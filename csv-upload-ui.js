Items = new Mongo.Collection('items');

if (Meteor.isClient) {
    Template.upload.events({
        'change [name=file]': function (event, template) {
            try {
                // Get the file from the form
                csvFile = event.target.files[0];
            } catch (e) {
                // If file not available
                console.log("Could not access file.");
            }

            // clear the file selector input
            event.target.value = "";

            // Parse the file to an object
            Papa.parse(csvFile, {
                header: true,
                dynamicTyping: true,
                complete: function (results) {
                    // get the data
                    data = results.data;

                    // Insert each record into collection
                    _.each(data, function (datum) {
                        record = datum;
                        record.dateCreated = new Date();
                        Items.insert(record);
                    });
                }
            });
        }
    });
    Template.display.helpers({
        'items': function () {
            // return all documents
            // reverse-sorted by date created
            return Items.find();
        }
    });
    Template.item.helpers({
        'itemKeyValue': function () {
            // This function maps the key/value pairs for a given document
            // to object attributes called 'key' and 'value'
            // so that the values can be accessed in the template by {{key}} and {{value}}


            // Create empty array
            var itemKeyValue = [];

            // counter variable
            var index = 0;

            // Find the active document
            var itemDoc = Items.findOne(this._id);

            // Iterate through each key/value pair in the document
            _(itemDoc).each( function( value, key, itemDoc ) {
                // Create an empty object at the index
                itemKeyValue[index] = {};

                // Set the key value to key
                itemKeyValue[index]['key'] = key;

                // Set the value value to value
                itemKeyValue[index]['value'] = value;

                // increment the counter
                index++;
            });
            console.log(itemKeyValue);
            return itemKeyValue;
        }
    });
};
