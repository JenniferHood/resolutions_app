Resolutions = new Mongo.Collection('Resolutions');

if (Meteor.isClient) {
  Meteor.subscribe("resolutions"); //subscribing to the data collection from the publication which is calling a resolutions.find()
  Template.body.helpers({
    resolutions: function() {
      if(Session.get('hideFinished')){
        return Resolutions.find({checked: {$ne: true}}); //$ne means 'is not'. As long as checked is not equal to true, it will find resolutions
      }else{
      return Resolutions.find();//returns all the resolutions
      }
    },

    hideFinished: function(){
      return Session.get('hideFinished');
    }
  });

  Template.body.events({
    'submit .new-resolution': function(event){
      var title = event.target.title.value;

    Meteor.call("addResolution", title);

      event.target.title.value = "" //this clears the placeholder

      return false; //this makes sure the page doesn't refresh
    },
    
    'change .hide-finished': function(event){
      Session.set('hideFinished', event.target.checked);//first arg name can be anything; used something that reflects the helper we are going to use
    }
  });


  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("resolutions", function(){
    return Resolutions.find({
      //Mongo query to return resolutions that are not set to private or is the owner
      $or: [ 
        { private: {$ne: true} }, //when resolution is not equal to private
        { owner: this.userId } //if the owner owns the resolution, always show it
      ]
    });
  });

}


Meteor.methods({
  addResolution: function(title){
     Resolutions.insert({ 
        title: title,
        createdAt: new Date(),
        owner: Meteor.userId()
      });
  },
  
  updateResolution: function(id, checked){
   var res = Resolutions.findOne(id);
    
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.update(id, {$set: {checked: checked}});
  },

  deleteResolution: function(id){
    var res = Resolutions.findOne(id);

    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.remove(id);
  },

  setPrivate: function(id, private){
    var res = Resolutions.findOne(id) //'findOne' is a Mongo DB method that will find one resolution from out collection
 
    if(res.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

      Resolutions.update(id, {$set: {private: private}});


  }
});











