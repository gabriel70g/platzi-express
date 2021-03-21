const { config } = require("./config");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const express = require("express");
const path = require("path");
const boom = require('@hapi/boom');
const debug = require("debug")("app:express");
const productsRouter = require("./routes/views/products");
const productsApiRouter = require("./routes/api/products");
const authApiRouter = require("./routes/api/auth")
const isRequestAjaxOrApi = require("./utils/isRequestAjaxOrApi");
const helmet = require('helmet');
const {
  LogErrors,
  clientErrorHnadler,
  errorHandler,
  wrapErrors,
} = require("./utils/midlewares/errorsHnadlers");


// app
const app = express();

// Sentry.init({
//   dns: `https://${config.sentryDns}.ingest.sentry.io/${config.sentryId}`,
//   integrations: [
//     // enable HTTP calls tracing
//     new Sentry.Integrations.Http({ tracing: true }),
//     // enable Express.js middleware tracing
//     new Tracing.Integrations.Express({
//       // to trace all requests to the default router
//       app,
//       // alternatively, you can specify the routes you want to trace:
//       // router: someRouter,
//     }),
//   ],
//   tracesSampleRate: 1.0,
// });

// middlewares
app.use(helmet())
app.use(express.json());

//static files
app.use("/static", express.static(path.join(__dirname, "public")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// routes
app.use("/products", productsRouter);
productsApiRouter(app);
app.use("/api/auth", authApiRouter);

// redirect
// app.use("/", function (req, res) {
//   res.redirect("/products");
// });

app.use(function (req, res, next) {
  if (isRequestAjaxOrApi(req)) {
    const {
      aoutput: { statusCode, payload },
    } = boom.notFound();

    res.status(statusCode).json(payload);
  }

  res.status(404).render("404");
})

// error handlers
app.use(LogErrors);
app.use(wrapErrors);
app.use(clientErrorHnadler);
app.use(errorHandler);

// // RequestHandler creates a separate execution context using domains, so that every
// // transaction/span/breadcrumb is attached to its own Hub instance
// app.use(Sentry.Handlers.requestHandler());
// // TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());
// // the rest of your app
// app.use(Sentry.Handlers.errorHandler());

// server
const server = app.listen(8000, function () {
  debug(`Listening http://localhost:${server.address().port}`);
});
