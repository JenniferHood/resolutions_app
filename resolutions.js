Resolutions = new Mongo.Collection('Resolutions');

if (Meteor.isClient) {
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

      Resolutions.insert({ //this saves new input into the DB& updates the view
        title: title,
        createdAt: new Date()
      });

      event.target.title.value = "" //this clears the placeholder

      return false; //this makes sure the page doesn't refresh
    },
    
    'change .hide-finished': function(event){
      Session.set('hideFinished', event.target.checked);//first arg name can be anything; used something that reflects the helper we are going to use
    }
  });

Template.resolution.events({ //adding functionality to the 'resolution' template, i.e: deleting from the DB
  'click .toggle-checked' : function(){
    Resolutions.update(this._id, {$set: {checked: !this.checked}});
  },

  'click .delete' : function(){ //dont need the event in the args, just leave it blank
    Resolutions.remove(this._id); //grabs the item and deleted the DB id of the item
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
}

