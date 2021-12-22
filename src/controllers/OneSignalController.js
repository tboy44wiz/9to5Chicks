const OneSignal = require('onesignal-node');


class OneSignalController {
    static client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID, process.env.ONESIGNAL_API_KEY);

    // Create Client
    static createClient = async (req, res) => {

        const client = this.client;

        if (client) {
            return res.status(201).json({
                success: true,
                code: 201,
                message: "Client created successfully.",
                data: client
            });
        }
        res.status(500).json({
            success: false,
            code: 500,
            message: "Ooops! Something went wrong on the server.",
            //data: response
        });
    };

    // Create Notification
    static createNotification = async (req, res) => {

        const { headings, contents, global_image, included_segments } = req.body

        const notification = {
            headings,
            contents,
            global_image,
            included_segments,
            /*filters: [
                { field: 'tag', key: 'level', relation: '>', value: 10 }
            ]*/
        };

        this.client.createNotification(notification)
            .then(response => {
                console.log(response.body.id);
                res.status(201).json({
                    success: true,
                    code: 201,
                    message: "Notification created successfully.",
                    data: response.body
                });
            })
            .catch(e => {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
                res.status(500).json({
                    success: false,
                    code: 500,
                    message: "Ooops! Something went wrong on the server.",
                    //data: response
                });
            });

    }

    // Cancel Notification
    static cancelNotification = async (req, res) => {

        this.client.cancelNotification('notification-id')
            .then(response => {
                console.log(response.body);
                console.log(response.headers);
                console.log(response.statusCode);
                res.status(200).json({
                    success: true,
                    code: 200,
                    message: "Notification canceled successfully.",
                    data: response
                });
            })
            .catch(e => {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
                res.status(500).json({
                    success: false,
                    code: 500,
                    message: "Ooops! Something went wrong on the server.",
                    //data: response
                });
            });

    }

    // View Notifications
    static viewNotifications = async (req, res) => {

        this.client.viewNotifications()
            .then(response => {
                res.status(200).json({
                    success: true,
                    code: 200,
                    message: "Notifications retrieved successfully.",
                    data: response.body
                });
            })
            .catch(e => {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
                res.status(e.statusCode).json({
                    success: false,
                    code: e.statusCode,
                    message: e.body.errors[0],
                    //data: response
                });
            });

    }

    // View Notification
    static viewNotification = async (req, res) => {

        const { notificationId } = req.body || req.params;

        this.client.viewNotification(notificationId)
            .then(response => {
                res.status(200).json({
                    success: true,
                    code: 200,
                    message: "Notification retrieved successfully.",
                    data: response.body
                });
            })
            .catch(e => {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
                res.status(e.statusCode).json({
                    success: false,
                    code: e.statusCode,
                    message: e.body.errors[0],
                    //data: response
                });
            });

    }

    // Create Segment.
    static createSegment = async (req, res) => {

        const { name, filters } = req.body;
        //  name: "Any Name"
        // filters: [{ field: 'tag', key: 'level', relation: '>', value: 10 }]

        this.client.createSegment({
            name,
            //filters
        })
            .then(response => {
                console.log(response.body);
                res.status(200).json({
                    success: true,
                    code: 200,
                    message: "Segment created successfully.",
                    data: response
                });
            })
            .catch(e => {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
                res.status(e.statusCode).json({
                    success: false,
                    code: e.statusCode,
                    message: e.body.errors[0],
                    //message: "Ooops! Something went wrong on the server.",
                    //data: response
                });
            });

    }

    // Delete Segment.
    static deleteSegment = async (req, res) => {

        const { segmentId } = req.body || req.params;

        this.client.deleteSegment(segmentId)
            .then(response => {
                console.log(response.body);
                res.status(200).json({
                    success: true,
                    code: 200,
                    message: "Segment deleted successfully.",
                    data: response
                });
            })
            .catch(e => {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
                res.status(e.statusCode).json({
                    success: false,
                    code: e.statusCode,
                    message: e.body.errors[0],
                    //message: "Ooops! Something went wrong on the server.",
                    //data: response
                });
            });

    }
}

export default OneSignalController;
