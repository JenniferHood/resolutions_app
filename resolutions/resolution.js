if (Meteor.isClient) {
  Template.resolution.helpers({
  isOwner: function(){
    return this.owner === Meteor.userId();
  }

});

Template.resolution.events({ //adding functionality to the 'resolution' template, i.e: deleting from the DB
  'click .toggle-checked' : function(){
    Meteor.call("updateResolution", this._id, !this.checked);
  },

  'click .toggle-private': function(){
    Meteor.call("setPrivate", this._id, !this.private);
  },

  'click .delete' : function(){ //dont need the event in the args, just leave it blank
    Meteor.call("deleteResolution", this._id); //grabs the item and deleted the DB id of the item
  }
});
}