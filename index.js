const
	mqtt = require("mqtt"),
	http = require("http"),
	app = require("express")(),
	bodyParser = require("body-parser"),
	config = require("./config.json");

if (!config) {
	throw new Error("Missing config.json file! See config.example.json");
}

console.log("Connecting to MQTT broker " + config.brokerUrl);
var oMqttClient = mqtt.connect(config.brokerUrl);

app.use(bodyParser.json());
app.post("/alexa", function(req, res) {
	if (!oMqttClient.connected) {
		console.log("Failed to connect to MQTT broker");
		res.status(500);
		res.send("Failed to connect to MQTT broker");
		return;
	}

	var sIntent = req.body.sIntent;
	console.log("Received intent " + sIntent);

	switch (sIntent) {
	case "EnterHome":
	case "LeaveHome":
	case "GoToSleep":
	case "WakeUp":
	case "Enable":
	case "Disable":
		oMqttClient.publish("Home/StateIntents", sIntent, {
			qos: 2,
			retain: true
		}, function(err) {
			if (err) {
				console.log("MQTT publish failed: " + err);
				res.status(500);
				res.send("Internal error");
			} else {
				console.log("Intent published");
				res.send("Intent published");
			}
		});
		break;
	default:
		console.log("Unknown intent");
		res.status(400);
		res.send("Unknown intent");
		break;
	}
});

http.createServer(app).listen(config.iHttpPort, function() {
	console.log("hercules-alexa-bridge running on port " + config.iHttpPort);
});
