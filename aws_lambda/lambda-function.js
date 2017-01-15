var http = require("http"),
	sBridgeHost = process.env.BRIDGE_HOST,
	iBridgePort = process.env.BRIDGE_PORT,
	buildSpeechletResponse, generateResponse, postToBridge;

exports.handler = function(event, context) {
	try {
		if (event.session.new) {
			console.log("NEW SESSION");
		}

		switch (event.request.type) {
		case "LaunchRequest":
			console.log("LAUNCH REQUEST");
			context.succeed(generateResponse(buildSpeechletResponse(
				"Hercules bereit", false), {}));
			break;
		case "IntentRequest":
			console.log("INTENT REQUEST: " + event.request.intent.name);

			switch (event.request.intent.name) {
			case "EnterHome":
				postToBridge({
					sIntent: event.request.intent.name
				}, function(res) {
					if (res.statusCode === 200) {
						context.succeed(generateResponse(buildSpeechletResponse(
							"Willkommen daheim", true), {}));
					} else {
						throw new Error("Unknown backend error");
					}
				});
				break;
			case "LeaveHome":
				postToBridge({
					sIntent: event.request.intent.name
				}, function(res) {
					if (res.statusCode === 200) {
						context.succeed(generateResponse(buildSpeechletResponse(
							"Bis bald", true), {}));
					} else {
						throw new Error("Unknown backend error");
					}
				});
				break;
			case "GoToSleep":
				postToBridge({
					sIntent: event.request.intent.name
				}, function(res) {
					if (res.statusCode === 200) {
						context.succeed(generateResponse(buildSpeechletResponse(
							"Gute Nacht", true), {}));
					} else {
						throw new Error("Unknown backend error");
					}
				});
				break;
			case "WakeUp":
				postToBridge({
					sIntent: event.request.intent.name
				}, function(res) {
					if (res.statusCode === 200) {
						context.succeed(generateResponse(buildSpeechletResponse(
							"Guten Morgen", true), {}));
					} else {
						throw new Error("Unknown backend error");
					}
				});
				break;
			case "Enable":
				postToBridge({
					sIntent: event.request.intent.name
				}, function(res) {
					if (res.statusCode === 200) {
						context.succeed(generateResponse(buildSpeechletResponse(
							"Hercules online", true), {}));
					} else {
						throw new Error("Unknown backend error");
					}
				});
				break;
			case "Disable":
				postToBridge({
					sIntent: event.request.intent.name
				}, function(res) {
					if (res.statusCode === 200) {
						context.succeed(generateResponse(buildSpeechletResponse(
							"Hercules offline", true), {}));
					} else {
						throw new Error("Unknown backend error");
					}
				});
				break;
			default:
				throw new Error("Invalid intent");
			}
			break;
		case "SessionEndedRequest":
			console.log("SESSION ENDED REQUEST");
			break;
		default:
			context.fail("INVALID REQUEST TYPE: " + event.request.type);
		}
	} catch (error) {
		context.fail("Exception: " + error);
	}
};

// Helpers
buildSpeechletResponse = function(outputText, shouldEndSession) {
	return {
		outputSpeech: {
			type: "PlainText",
			text: outputText
		},
		shouldEndSession: shouldEndSession
	};
};

generateResponse = function(speechletResponse, sessionAttributes) {
	return {
		version: "1.0",
		sessionAttributes: sessionAttributes,
		response: speechletResponse
	};
};

postToBridge = function(oData, callback) {
	var req, sBody;
	sBody = JSON.stringify(oData);

	req = http.request({
		host: sBridgeHost,
		port: iBridgePort,
		path: "/alexa",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(sBody)
		}
	}, callback);

	req.end(sBody);
};
