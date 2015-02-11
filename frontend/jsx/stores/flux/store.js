var Educator = require("./educator_store.js"),
    Course = require("./course_store.js"),
    Testimonial = require("./testimonial_store.js"),
    Instructor = require("./instructor_store.js"),
    User = require("./user_store.js"),
    Lead = require("./lead_store.js"),
    Order = require("./order_store.js"),
    Alert = require("./alert_store.js"),
    Coupon = require("./coupon_store"),
    Plan = require("./plan_store"),
    Processing = require("./processing_store.js")
    Statistic = require("./course_statistic_store.js")

var stores = {Educator, Testimonial, Instructor, User, Order, Course, Alert, Coupon, Plan, Lead, Processing, Statistic};

stores.ALL = stores

module.exports = stores
