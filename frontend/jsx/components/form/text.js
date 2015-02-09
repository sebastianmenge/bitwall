var T = {}

function form(formType, fun){
  fun(function(field, {label,hint}){
    T[formType+"."+field+".label"] = label
    T[formType+"."+field+".hint"] = hint||""
  })
}

form("COURSE", function(f){
  f("name",               {label: "Course Title", hint: "TIP: choose a short, descriptive and convincing title!"})
  f("slug",               {label: "Course Page URL", hint: "TIP: use this link to reach the course page."})
  f("heading",            {label: "Course Page Heading", hint: "TIP: this will appear at the top of the course page. If you leave it empty, the course title will be used instead."})
  f("subtitle",           {label: "Short Description", hint: "TIP: explain in a few words the content of your course."})
  f("teaserImage",        {label: "Course Teaser Image", hint: "TIP: use a 16:9 ratio image, with a resolution of at least 480x270px (ideally 960x540px). Accepted formats: jpg, png, gif, bmp (max 5MB)."})
  f("promoVideo",         {label: "Promotional Video", hint: "TIP: use a 16:9 ratio video, in high resolution (ideally 1920x1080px). Accepted formats: mp4, mov, avi, wmv, flv, mpg, mkv (max 2GB)."})
  f("pageBgImage",        {label: "Page Background Image", hint: "TIP: use a 16:9 ratio image, in high resolution (ideally 1920x1080ppx). Accepted formats: jpg, png, gif, bmp (max 5MB)."})
  f("benefits",           {label: "Course Benefits", hint: "TIP: catch the attention of potential students with a concise list of benefits of your course."})
  f("description",        {label: "Course Summary", hint: "TIP: explain in details what your course is about, how the learning is structured and why people should enroll (advanced users can also edit the HTML code)."})
  f("instructor",         {label: "Instructor", hint: "TIP: show who is teaching the course and increase the trust of potential students. To edit existing instructors or add new ones, <a href='/admin2/instructors' target='_blank'><u>click here</u></a>."})
  f("rating",             {label: "Customer Rating", hint: "TIP: choose the average rating you want to display for this course (min 1, max 5)."})
  f("testimonials",       {label: "Testimonials", hint: "TIP: feature the feedback of existing students. To edit existing testimonials or add new ones <a href='/admin2/testimonials' target='_blank'><u>click here</u></a>."})
  f("testimonials.name",  {label: "Featured Testimonials"})
  f("language",               {label: "Course Language", hint: "TIP: choose the language in which you are providing the learning material."})
  f("courseLevel",            {label: "Instructional Level", hint: "TIP: define the skillset of your target audience."})
  f("category",               {label: "Category", hint: "TIP: choose the category that fits your course best."})
  f("tags",               {label: "Course Topics", hint: "TIP: add a list of the topics covered in this course."})
  f("workload",               {label: "Expected workload", hint: "TIP: provide an estimate about the average time needed to complete the course."})
  f("sku",                    {label: "Course Identifier", hint: "TIP: the default value is the Patience course ID. You can modify it accordingly to your internal accounting structure."})
  f("goal",                   {label: "Goals & Objectives", hint: "TIP: explain what can be achieved by completing this course."})
  f("audience",               {label: "Intended Audience", hint: "TIP: explain which kind of people will find this course interesting."})
  f("prerequisites",          {label: "Course Requirements", hint: "TIP: explain what needs to be done before starting the course."})
  f("satisfactionWarranty",   {label: "Satisfaction Guarantee", hint: "TIP: if you don't want to provide a money back guarantee, simply delete the content of this FAQ."})
  f("accessRules",            {label: "Access to the Course", hint: "TIP: explain how your students will access this course."})
  f("courseDuration",         {label: "Course Duration", hint: "TIP: explain for how long students will have access to this course."})
})

form("OFFER", function(f){
  f("amount",                 {label: "Course Price", hint: "TIP: choose the basic price of your course (enter '0' to offer a course for free)."})
  f("trialPeriodSeconds",     {label: "Trial Length", hint: "TIP: allow potential students to try the course before buying it. If you want don't want to offer a trial, enter '0'."})
})

form("USER", function(f){
  f("title",          {label: "Title"})
  f("firstname",      {label: "Firstname"})
  f("surname",        {label: "Surname"})
  f("company",        {label: "Company"})
  f("birthday",       {label: "Birthday"})
  f("gender",         {label: "Gender"})
  f("locale",         {label: "Language"})
  f("currency",       {label: "Currency"})
  f("email",          {label: "Email"})
  f("emailOptin",     {label: "Email Opt-in", hint: "TIP: yes if the student agreed to receive promo emails."})
  f("phone",          {label: "Phone Number"})
  f("street",         {label: "Street"})
  f("streetNo",       {label: "Street No."})
  f("city",           {label: "City"})
  f("country",        {label: "Country"})
})

form("LECTURE", function(f){
  f("name",                 {label: "Lecture Title"})
  f("mediaFile",            {label: "Media Content", hint: "TIP: you can add videos (avi, mpg, mp4, flv, mov, mkv. Max 2GB) and images (jpg, png, gif, bmp. Max 5MB). You can skip this step if you want to create a lecture with only textual content."})
  f("previewable",          {label: "Allow Free Preview", hint: "TIP: allow potential students to view the content of this lecture before buying a course."})
  f("content",              {label: "Text Content", hint: "TIP: add textual content to expand the scope of this lecture. This section will only be accessible to students enrolled in the course or in a trial (advanced users can also edit the HTML code)."})
  f("publicDescription",    {label: "Public Description", hint: "TIP: quickly describe the content of this lecture. The information provided will be available publicly and will help to drive even more organic traffic to your website."})
  f("learnUnitAttachments", {label: "Lecture Attachments", hint: "TIP: provide learning material to complement the main lecture content. They will only be accessible to students enrolled in the course or in a trial."})
})

form("QUIZ", function(f){
  f("name",                 {label: "Quiz Title"})
  f("content",              {label: "Text Content", hint: "TIP: describe the content of this quiz. The information provided will be shown to the students before they start the quiz."})
})

form("MC_QUESTION", function(f){
  f("question",           {label:"Question", hint:"TIP: write the question you want to ask your students."});
  f("description",        {label:"Answer's Feedback", hint:"TIP: to give a better feedback to your students, you can add an explanation as to why specific options are correct or not."});
  f("learnUnits",         {label:"Connected Lectures", hint: "TIP: mark all the lectures that cover content that is necessary to answer this question."})
  f("learnUnits.name",    {label:"Connected Lectures"})
  f("mcQuestionOptions",  {label:"Answer Options", hint:"TIP: add all the possible options that will be presented to your students (<b>at least 2</b>) and assign them a true or false value."});
  f("mcQuestionOptions.answer",  {label:"Answer Option"});
  f("mcQuestionOptions.correct", {label:"True/False?"});
});

form("TEXT_QUESTION", function(f){
  f("question",           {label:"Question", hint:"TIP: write the question you want to ask your students."});
  f("answerText",         {label:"Sample Correct Answer", hint:"TIP: provide your version of the correct answer to the question. It will be shown to the students after they submit their answer."}),
  f("learnUnits",         {label:"Connected Lectures", hint: "TIP: mark all the lectures that cover content that is necessary to answer this question."})
  f("learnUnits.name",    {label:"Connected Lectures"})
});

form("EDUCATOR", function(f){
  f("pageHeading",                {label: "Page Heading"})
  f("pageSubheading",             {label: "Page Subheading"})
  f("pageBgImage",                {label: "Page Background Image", hint: "TIP: use a 16:9 ratio image, in high resolution (ideally 1920x1080ppx). Accepted formats: jpg, png, gif, bmp (max 5MB)."})
  f("pagePromoVideo",             {label: "Promotional Video", hint: "TIP: use a 16:9 ratio video, in high resolution (ideally 1920x1080px). Accepted formats: mp4, mov, avi, wmv, flv, mpg, mkv (max 2GB)."})
  f("pageTeaserImage",            {label: "Promotional Image", hint: "TIP: use a 16:9 ratio image, with a resolution of at least 480x270px (ideally 960x540px). Accepted formats: jpg, png, gif, bmp (max 5MB)."})
  f("pageShowSignupBox",          {label: "Show Signup Box", hint: "TIP: allow potential students to register to your platform directly from the welcome page."})
  f("pageAboutText",              {label: "Extra Content", hint: "TIP: explain what your website is about and what kind of courses you are offering (advanced users can also edit the HTML code)."})
  f("featuredCourses",            {label: "Featured Courses", hint: "TIP: choose which courses you want to display in the welcome page. To create a new course <a href='/admin2/courses' target='_blank'><u>click here</u></a>."})
  f("featuredCourses.name",       {label: "Course Title"})
  f("featuredInstructors",        {label: "Featured Instructors", hint: "TIP: show who is teaching the course and increase the trust of potential students. To edit existing instructors or add new ones, <a href='/admin2/instructors' target='_blank'><u>click here</u></a>."})
  f("featuredInstructors.name",   {label: "Featured Instructors"})
  f("featuredTestimonials",       {label: "Featured Testimonials", hint: "TIP: feature the feedback of existing students. To edit existing testimonials or add new ones, <a href='/admin2/testimonials' target='_blank'><u>click here</u></a>."})
  f("featuredTestimonials.name",  {label: "Featured Testimonials"})

  f("socialExternalWebsite",      {label: "External Links"})
  f("socialFacebook",             {label: "Facebook Page"})
  f("socialTwitter",              {label: "Twitter"})
  f("socialGoogleplus",           {label: "Google+ Page"})
  f("socialLinkedin",             {label: "LinkedIn Page"})
  f("socialYoutube",              {label: "YouTube Channel"})

  f("favicon",      {label: "Favicon", hint: "TIP: use a 1:1 ratio icon image, with a resolution of 32x32px. Accepted formats: jpg, png."})
  f("logo",         {label: "Logo", hint: "TIP: use a 1:3 ratio image, with a resolution of at least 300x100px. Accepted formats: jpg, png (max 5MB)."})
  f("brandColor",   {label: "Brand Color", hint: "TIP: select the color (<a href='http://www.colorpicker.com/' target='_blank'><u>hexadecimal format</u></a>) that fits your identity most and it will be used throughout the website."})
  f("customStyle",  {label: "Custom CSS", hint: "TIP: define your own CSS rules to overwrite the Patience default stylesheet."})
  f("name",                           {label: "School/Site Name *", hint: "TIP: this is the name of your eLearning site, that will be used in every communciation with your users."})
  f("contractWebsite",                {label: "Existing Website", hint: "TIP: tell us if you already have another website."})
  f("contractContactRepresentative",  {label: "Contact Person *", hint: "TIP: the main reference point for your platform."})
  f("contractContactEmail",           {label: "Contact Email *", hint: "TIP: provide a contact email for your platform."})
  f("contractContactPhone",           {label: "Contact Phone", hint: "TIP: provide a phone number for your platform."})
  f("contractStreet",    {label: "Street"})
  f("contractStreetNo",  {label: "Street Number"})
  f("contractCity",      {label: "City"})
  f("contractState",     {label: "State / Province / Region"})
  f("contractZip",       {label: "ZIP / Postal Code"})
  f("contractCountry",   {label: "Country of operations", hint: "TIP: where you live, or where your company is registred."})
  f("contractCompany",   {label: "Company Name <small>(optional)</small>", hint: "TIP: if you operate the website via a legal entity, please fill in this form."})
  f("contractVatNo",     {label: "VAT Number <small>(optional)</small>", hint: "TIP: include this value if you have a company."})
  f("payoutPaypalEmail", {label: "PayPal Email", hint: "TIP: it must be connected to an existing PayPal account."})
})

form("TESTIMONIAL", function(f){
  f("name",                 {label: "Name *"})
  f("headline",             {label: "Headline"})
  f("mediaFile",            {label: "Profile Picture *", hint: "TIP: use a 1:1 ratio image, with a resolution of at least 300x300px (ideally 600x600px). Accepted formats: jpg, png, gif, bmp (max 5MB)."})
  f("quote",                {label: "Quote"})
  f("email",                {label: "Contact Email", hint: "TIP: provide a valid email if you want to share a personal contact for your students."})

  f("website",              {label: "External Website"})
  f("facebook",             {label: "Facebook Profile"})
  f("twitter",              {label: "Twitter"})
  f("googleplus",           {label: "Google+ Profile"})
  f("linkedin",             {label: "LinkedIn Profile"})
  f("youtube",              {label: "YouTube Channel"})
})

form("INSTRUCTOR", function(f){
  f("name",                 {label: "Name *"})
  f("designation",          {label: "Title", hint: "TIP: a professional or academic title (e.g. Ph.D.)."})
  f("mediaFile",            {label: "Profile Picture *", hint: "TIP: use a 1:1 ratio image, with a resolution of at least 300x300px (ideally 600x600px). Accepted formats: jpg, png, gif, bmp (max 5MB)."})
  f("headline",             {label: "Skills and Qualifications *", hint: "TIP: add additional skills, e.g. training expert or business consultant"})
  f("email",                {label: "Contact Email", hint: "TIP: provide a valid email if you want to give your students a direct way to contact the testimonial."})
  f("biography",            {label: "Biography", hint: "TIP: build credibility with potential students by explaining the instructor's experience and expertise."})
  f("quote",                {label: "Inspirational Quote About Yourself", hint: "TIP: build credibility with potential students by telling the instructor's passion for the <strong>pre launch page</strong>."})

  f("website",              {label: "External Website"})
  f("facebook",             {label: "Facebook Profile"})
  f("twitter",              {label: "Twitter"})
  f("googleplus",           {label: "Google+ Profile"})
  f("linkedin",             {label: "LinkedIn Profile"})
  f("youtube",              {label: "YouTube Page"})
})

form("COUPON", function(f) {
  f("couponCode",           {label: "Coupon Code", hint: "TIP: define the code that will grant the discounted price (accepted characters: A-Z, 0-9, _ and -)."})
  f("reductionValue",       {label: "Discount Percentage", hint: "TIP: choose how much discount you want to give with this code (type '100' to make the course free)."})
  f("course",               {label: "Limit to selected course", hint: "TIP: if you want the coupon to be usable only on a single course, select it from the list. Otherwise, it will be valid for <b>all</b> courses."})
  f("maximumUsage",         {label: "Maximum Global Usage", hint: "TIP: specify the number of times the code can be used in total (leave empty if you want it to be unlimited)."})
  f("validUntil",           {label: "Expiration Date", hint: "TIP: choose the day from which the coupon will not be valid anymore (leave empty if you don't want it to expire)."})
})

module.exports = function(key){
  var t = T[key]

  if(t === undefined)
    t = "undefined:"+key

  return t
}
