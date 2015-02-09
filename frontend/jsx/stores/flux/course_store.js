var _ = require("underscore"),
    Promise = require("bluebird"),
    Router = require("react-router"),
    Dispatcher = require("../../dispatchers/patience_dispatcher.js"),
    {copy, findImageUrl, formatMoney} = require("../../util.js"),
    FluxStore = require("../lib/flux_store.js"),
    EducatorStore = require("./educator_store.js"),
    InstructorStore = require("./instructor_store.js"),
    req = require("../lib/req.js"),
    RestRepo = require("../lib/rest_repo.js")

var CourseStore = _.extend(new FluxStore("course"))

var FileRepo = CourseStore.defineCollection({
  type: "FILE",
  url: "/ebe-api2/files"
})
var OfferRepo = CourseStore.defineCollection({
  type: "OFFER",
  url: "/ebe-api2/offers"
})
var LearnUnitAttachmentRepo = CourseStore.defineCollection({
  type: "LEARN_UNIT_ATTACHMENT",
  url: "/ebe-api2/learn_unit_attachments",
  links: {
    file: {cardinality: "one", type: "FILE"},
    learnUnit: {cardinality: "one", type: "LEARN_UNIT"}
  },
  decorate: function(e){
    return {
      fileUrl: CourseStore.getFile(e.links.file).url,
      fileType: CourseStore.getFile(e.links.file).type
    }
  }
});

var CourseItemRepo = CourseStore.defineCollection({
  type: "COURSE_ITEM",
  url: "/ebe-api2/course_items"
})

var SectionRepo = CourseStore.defineCollection({
  type: "SECTION",
  url: "/ebe-api2/sections",
  links: {
    course: {cardinality: "one", type: "COURSE"}
  }
})

var CourseRepo = CourseStore.defineCollection({
  type: "COURSE",
  url: "/ebe-api2/courses",
  links: {
    testimonials:   {cardinality: "many", type: "TESTIMONIAL"},
    instructor:     {cardinality: "one",  type: "INSTRUCTOR"},
    courseItems:    {cardinality: "many", type: "COURSE_ITEM"},
    learnUnits:     {cardinality: "many", type: "LEARN_UNIT"},
    quizzes:        {cardinality: "many", type: "QUIZ"},
    sections:       {cardinality: "many", type: "SECTION"},
    teaserImage:    {cardinality: "one",  type: "FILE"},
    promoVideo:     {cardinality: "one",  type: "FILE"},
    pageBgImage:    {cardinality: "one",  type: "FILE"},
    offer:          {cardinality: "one",  type: "OFFER"}
  },
  decorate: function(e){
    var offer = CourseStore.getOffer(e.links.offer)
    return {
      imageUrl: findImageUrl(CourseStore.getFile(e.links.teaserImage)) || "https://patience-live.s3.amazonaws.com/f5/3911a02d0211e49cb46d7c8598d8f6/teaser_image-key-446875d54ec1c22b7d5deef8b5056d9e2728f671.jpg",
      backgroundUrl: findImageUrl(CourseStore.getFile(e.links.pageBgImage)) || "https://patience-live.s3.amazonaws.com/df/a00bf02d0211e482419b233cbb5dd5/background-key-4ca91bce799a6fc333937cd1395e7fec423edb93.jpg",
      price: offer ? formatMoney(offer.amount, offer.currency) : "",
      rawPrice: offer ? offer.amount : -1
    }
  }
})

var QuizRepo = CourseStore.defineCollection({
  type: "QUIZ",
  url: "/ebe-api2/quizzes",
  links: {
    questions: {cardinality: "many", type: "QUESTION"},
    textQuestions: {cardinality: "many", type: "TEXT_QUESTION"},
    mcQuestions: {cardinality: "many", type: "MC_QUESTION"}
  }
})

var LectureRepo = CourseStore.defineCollection({
  type: "LECTURE",
  url: "/ebe-api2/learn_units",
  links: {
    mediaFile: {cardinality: "one", type: "FILE"},
    learnUnitAttachments: {cardinality: "many", type: "LEARN_UNIT_ATTACHMENT"}
  },
  decorate: function(e){
    return {imageUrl: findImageUrl(CourseStore.getFile(e.links.mediaFile))}
  }
})

var QuestionRepo = CourseStore.defineCollection({
  type: "QUESTION",
  url: "/ebe-api2/questions"
});

var TextQuestionRepo = CourseStore.defineCollection({
  type: "TEXT_QUESTION",
  url: "/ebe-api2/text_questions"
});

var McQuestionRepo = CourseStore.defineCollection({
  type: "MC_QUESTION",
  url: "/ebe-api2/mc_questions",
  links: {
    mcQuestionOptions: {cardinality: "many", type: "MC_QUESTION_OPTION", isOwner: true},
  }
});

var McQuestionOptionRepo = CourseStore.defineCollection({
  type: "MC_QUESTION_OPTION",
  url: "/ebe-api2/mc_question_options",
  decorateCollection: function(entries){
    return _.compact(entries)
  }
});

CourseStore.initialize = function(ids){
  this.dependsOn([EducatorStore])

  var courses = CourseRepo.getEntries(ids),
      courseItems = courses.map(e => e.links.courseItems).then(_.flatten).then(CourseItemRepo.getEntries),
      lectures = courses.map(e => e.links.learnUnits).then(_.flatten).then(LectureRepo.getEntries),
      quizzes = courses.map(e => e.links.quizzes).then(_.flatten).then(QuizRepo.getEntries),
      learnUnitAttachments = lectures.map(e => e.links.learnUnitAttachments).then(_.flatten).then(LearnUnitAttachmentRepo.getEntries),
      offers = courses.map(e => e.links.offer).filter(e => !!e).then(_.flatten).then(OfferRepo.getEntries),
      questions = quizzes.map(e => e.links.questions).then(_.flatten).then(QuestionRepo.getEntries),
      textQuestions = quizzes.map(e => e.links.textQuestions).then(_.flatten).then(TextQuestionRepo.getEntries),
      mcQuestions = quizzes.map(e => e.links.mcQuestions).then(_.flatten).then(McQuestionRepo.getEntries),
      mcQuestionOptions = mcQuestions.map(e => e.links.mcQuestionOptions).then(_.flatten).then(McQuestionOptionRepo.getEntries);

  var courseTeaserImageFiles = courses.map(e => e.links.teaserImage),
      coursePromoVideoFiles = courses.map(e => e.links.promoVideo),
      coursePageBgImageFiles = courses.map(e => e.links.pageBgImage),
      lectureFiles = lectures.map(e => e.links.mediaFile),
      lectureAttachmentFiles = learnUnitAttachments.map(e => e.links.file)

  var files = Promise.all([courseTeaserImageFiles, coursePromoVideoFiles, coursePageBgImageFiles, lectureFiles, lectureAttachmentFiles]).then(function(files){
    return _.select(_.flatten(files), e => !!e)
  }).then(FileRepo.getEntries)

  return Promise.join(quizzes, courses, courseItems, lectures, files, offers, learnUnitAttachments, questions, textQuestions, mcQuestions, mcQuestionOptions, function(quizzes, courses, courseItems, lectures, files, offers, learnUnitAttachments, questions, textQuestions, mcQuestions, mcQuestionOptions){
    CourseStore._quizzes = quizzes
    CourseStore._lectures = lectures
    CourseStore._courses = courses
    CourseStore._courseItems = courseItems
    CourseStore._files = files
    CourseStore._offers = offers
    CourseStore._learnUnitAttachments = learnUnitAttachments
    CourseStore._questions = questions
    CourseStore._textQuestions = textQuestions
    CourseStore._mcQuestions = mcQuestions
    CourseStore._mcQuestionOptions = mcQuestionOptions
  })
}

CourseStore.register(function(payload){

  var action = payload.action

  switch(action.type){

    case "COURSE_LINKS_CHANGED":
      var files = _.select(_.values(_.pick(action.model.links, "teaserImage","pageBgImage","promoVideo")), e => !!e)

      return FileRepo.getEntries(files).bind(this).then(function(files){
        _.each(files, e => this._files.push(e))
      }).then(this.emitChange)

    case "COURSE_ITEM_SORT":
      var course = _.detect(CourseStore._courses, e => e.id == action.models[0].links.course)
      course.links.courseItems = _.pluck(action.models, "id")
      return req("put", "/ebe-api2/course_items/actions/sort", {ids: _.pluck(action.models, "id")}).then(this.emitChange)

    case "SECTION_CREATED":
      var courseId = action.model.links.course
      return CourseRepo.reload(courseId).then(function(){
        return CourseItemRepo.getEntry(action.id).tap(function(courseItem){
          CourseStore._courseItems.push(courseItem)
        })
      }).then(this.emitChange)

    case "LECTURE_LINKS_CHANGED":
      var files = _.select(_.values(_.pick(action.model.links, "mediaFile")), e => !!e)

      return FileRepo.reload(files).bind(this).then(function(files){
        _.each(files, e => this._files.push(e))
      }).then(this.emitChange)

    case "LECTURE_CREATED":
      var courseId = action.model.links.course
      return CourseRepo.reload(courseId).then(function(){
        return CourseItemRepo.getEntry(action.id).tap(function(courseItem){
          CourseStore._courseItems.push(courseItem)
        })
      }).then(this.emitChange)

    case "QUIZ_CREATED":
      var courseId = action.model.links.course
      return CourseRepo.reload(courseId).then(function(){
        return CourseItemRepo.getEntry(action.id).tap(function(courseItem){
          CourseStore._courseItems.push(courseItem)
        })
      }).then(this.emitChange)

    case "LEARN_UNIT_ATTACHMENT_CREATED":
      return LectureRepo.getEntry(action.model.links.learnUnit).then(function(learnUnit) {
        learnUnit.links.learnUnitAttachments.push(action.model.id)
        console.log('action', action);
        return LearnUnitAttachmentRepo.getEntry(action.id).tap(function(learnUnitAttachment) {
          console.log('learnUnitAttachment', learnUnitAttachment);
          CourseStore._learnUnitAttachments.push(learnUnitAttachment)
        })
      }).then(this.emitChange)

    case "OFFER_CREATED":
      var offer = action.model,
          course = _.omit(copy(CourseStore.getCourse(offer.links.course)), "links")

      course.offer = {id: offer.id}

      return setTimeout(function(){
        Dispatcher.handleServerAction({type: "COURSE_UPDATE", id: course.id, values: _.pick(course, 'offer')})
      }, 0)

    case "LECTURE_UPDATED":
      return CourseItemRepo.reload(action.id).then(this.emitChange)

    case "COURSE_ITEM_UPDATED":
      if(action.model.type == "LearnUnit")
        LectureRepo.reload(action.id).then(this.emitChange)

      if(action.model.type == "Section")
        SectionRepo.reload(action.id).then(this.emitChange)

      if(action.model.type == "Quiz")
        QuizRepo.reload(action.id).then(this.emitChange)

      break

    case "COURSE_CREATED":
      setTimeout(function () {
        Dispatcher.handleViewAction({type: "COURSE_UPDATE", id: action.model.id, values: {
          satisfactionWarranty: "<p>We're very confident about the quality of our course, but if for any reason you are unsatisfied, contact us within 15 days of the purchase and we will give you a full refund, no question asked!</p>",
          accessRules: "<p>After enrolling in the course, you will always have unlimited online access to all the lectures and to the learning materials, on any computer, tablet or mobile device you own.</p>",
          courseDuration: "<p>The course starts after you enroll and never ends! It is a completely self-paced online course, and it’s up to you to define when to start and when to access the course material.</p>",
          benefits: "<ul><li>Book your course &amp; start learning right away</li><li>Learn from expert instructors</li><li>Study at your own pace</li><li>Quickly improve your skills</li></ul>"
        }})

        Dispatcher.handleViewAction({type: "OFFER_CREATE", values: {courseId: action.id, amount: 2900, trialPeriodSeconds: 0}})

        return Router.transitionTo("courses/dashboard", {courseId: action.model.id})
      }, 0)
      break


    case "QUESTION_SORT":
      var quiz = _.detect(CourseStore._quizzes, e => e.id == action.models[0].links.quiz)
      _.each(action.models, (e, idx) => e.sortIndex = idx)
      quiz.links.questions = _.pluck(action.models, "id")
      return req("put", "/ebe-api2/questions/actions/sort", {ids: _.pluck(action.models, "id")}).then(this.emitChange)

    case "MC_QUESTION_CREATED":
      return QuizRepo.getEntry(action.model.links.quiz).then(function(quiz){
        return McQuestionRepo.getEntry(action.id).tap(function(question){
          McQuestionOptionRepo.getEntries(question.links.mcQuestionOptions).each(function(option) {
            CourseStore._mcQuestionOptions.push(option);
          })
          CourseStore._questions.push(question);
          quiz.links.questions.push(question.id);
        })
      }).then(this.emitChange);
    case "TEXT_QUESTION_CREATED":
      return QuizRepo.getEntry(action.model.links.quiz).then(function(quiz){
        return QuestionRepo.getEntry(action.id).tap(function(question){
          CourseStore._questions.push(question);
          quiz.links.questions.push(question.id);
        })
      }).then(this.emitChange);

    case "MC_QUESTION_UPDATED":
      return Promise.all([
          McQuestionOptionRepo.reload(action.model.links.mcQuestionOptions).tap(function(options) {
            CourseStore._mcQuestionOptions = _.union(CourseStore._mcQuestionOptions,options);
          }),
          QuestionRepo.reload(action.id)
        ]).then(this.emitChange);
    case "TEXT_QUESTION_UPDATED":
      return QuestionRepo.reload(action.id).then(this.emitChange);
  }

})

module.exports = CourseStore
