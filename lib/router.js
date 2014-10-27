Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function () {
        return [Meteor.subscribe('users')];
    }
});
Router.map(function () {
    this.route('roomList', {
        path: '/',
        waitOn: function () {
            return Meteor.subscribe('availableRooms');
        },
        data: function () {
            return Rooms.find()
        }
    });
    this.route('roomView', {
        path: '/room/:_id',
        waitOn: function () {
            Session.setDefault('messageLimit', 100);
            return [Meteor.subscribe('messages', this.params._id, Session.get('messageLimit')), Meteor.subscribe('availableRooms'), Meteor.subscribe('currentRooms')];
        },
        data: function () {
            Session.set('currentRoom', this.params._id);
            var returnObj = {
                messages: Messages.find({roomId: this.params._id}, {sort: {timestamp: 1}}),
                currentRooms: Rooms.find({users:Meteor.userId()}),
                availableRooms: Rooms.find()
            };
            return returnObj;
        }
    });
});
Router.onBeforeAction('loading');