var buildSpeechletResponse, generateResponse;

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
				context.succeed(generateResponse(buildSpeechletResponse(
					"Willkommen daheim", true), {}));
				break;
			case "LeaveHome":
				context.succeed(generateResponse(buildSpeechletResponse(
					"Bis bald", true), {}));
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
