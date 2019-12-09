var mongoose = require('mongoose');
var Campground = require('./models/campground');
var comment = require('./models/comment');



var data = [{
        name: "Warm breeze",
        image: "http://www.hotel-r.net/im/hotel/caribbean/do/ocean-breeze-4.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum:"
    },
    {
        name: "Cold breeze",
        image: "http://www.hotel-r.net/im/hotel/caribbean/do/ocean-breeze-4.jpg",
        description: " long established fact that a reader will be distracted by the readable content of a page when lo"
    },
    {
        name: "Summer breeze",
        image: "https://fsa.zobj.net/crop.php?r=NAL1F4XaLmve6WYuynlZtSJr5XQlbDmc42XwyCZmCEEhjoWJHnngJNeimUHYScHqMWhoPInje-X5XgTMazeUp89n9xJ07dzbULCLONPCdXr0TRr0FeMW4tddXHlxau_rPx5TSeLcTKNFwEl7",
        description: "long established fact that a reader will be distracted by the readable content of a page when lo"
    }


];

function seedDb() {
    // Here remove all the campgrounds 
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("removed all camgrounds");

        // Here add a few campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, camp) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Created campground");
                    // Create a comment
                    comment.create({
                        text: "this is a beatuiful place",
                        author: "Aman"

                    }, function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            camp.comments.push(data);
                            camp.save();
                            console.log("comments added");
                        }
                    });

                }
            });
        });
    });
}

module.exports = seedDb;