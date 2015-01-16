Items = new Mongo.Collection('items');

if (Meteor.isClient) {
    Template.upload.events({
        'change [name=file]': function (event, template) {
            console.log("Changed!");
            try {
                // Get the file from the form
                csvFile = event.target.files[0];
            } catch (e) {
                // If file not available
                console.log("Could not access file.");
            }
            // Parse the file to an object
            Papa.parse(csvFile, {
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    // get the data
                    data = results.data;

                    // Insert each datum into collection
                    _.each(data, function (datum) {
                        Items.insert(datum);
                    });
                }
            });
        }
    });
    Template.display.helpers({
        'items': function () {
            return Items.find({});
        }
    });
};



if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
