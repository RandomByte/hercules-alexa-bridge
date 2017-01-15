var http = require("http"),
	sBridgeHost = process.env.BRIDGE_HOST,
	iBridgePort = process.env.BRIDGE_PORT,
	buildSpeechletResponse, generateResponse, postToBridge;

exports.handler = function(event, context) {
	try {
		if (event.session.new) {
			// New Session
			console.log("NEW SESSION");
		}

		switch (event.request.type) {
		case "LaunchRequest":
			// Launch Request
			console.log("LAUNCH REQUEST");
			context.succeed(generateResponse(buildSpeechletResponse(
				"Hercules bereit", true), {}));
			break;
		case "IntentRequest":
			// Intent Request
			console.log("INTENT REQUEST: " + event.request.intent.name);

			switch (event.request.intent.name) {
			case "EnterHome":
				postToBridge({
					sIntent: event.request.intent.name
				}, function() {
					context.succeed(generateResponse(buildSpeechletResponse(
						"Willkommen daheim", true), {}));
				});
				break;
			case "LeaveHome":
				postToBridge({
					sIntent: event.request.intent.name
				}, function() {
					context.succeed(generateResponse(buildSpeechletResponse(
						"Bis bald", true), {}));
				});
				break;
			default:
				throw new Error("Invalid intent");
			}
			break;
		case "SessionEndedRequest":
			// Session Ended Request
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
