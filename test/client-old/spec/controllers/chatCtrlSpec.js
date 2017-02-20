'use strict';

describe("Chat Controller", function() {
  var scope, ctrl, user, $rootScope, $controller,
    User, Chat, Analytics, Notification, Groups;

  beforeEach(function() {
    module(function($provide) {
      Chat = {
        postChat: sandbox.stub(),
        deleteChat: sandbox.stub(),
        like: sandbox.stub(),
        markChatSeen: sandbox.stub(),
      };

      Analytics = {
        updateUser: sandbox.spy(),
        track: sandbox.spy(),
      };

      User = {
      };

      Notification = {
        text: sandbox.stub(),
      };

      Groups = {
        tavern: sandbox.stub(),
        party: sandbox.stub(),
        Group: {
          get: sandbox.stub(),
        },
        TAVERN_NAME: 'HabitRPG',
      };

      $provide.value('User', User);
      $provide.value('Chat', Chat);
      $provide.value('Analytics', Analytics);
      $provide.value('Notification', Notification);
      $provide.value('Groups', Groups);
    });

    inject(function(_$rootScope_, _$controller_) {
      user = specHelper.newUser();
      user.id = user._id = "unique-user-id";
      user.contributor = {};
      User.user = user;

      $rootScope = _$rootScope_;

      scope = _$rootScope_.$new();

      $controller = _$controller_;

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: {user: user}});

      ctrl = $controller('ChatCtrl', {$scope: scope});
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('isUserMentioned', () => {
    it('returns message.highlight if message has highlight', () => {
      let user = {};
      let message = {
        highlight: 'highlight',
      };

      let result = scope.isUserMentioned(user, message);

      expect(result).to.eql(message.highlight);
    })

    it('returns false if user is not mentioned', () => {
      let user = {
        profile: {name: 'test-user'},
      };
      let message = {
        text: 'hello',
      };

      let result = scope.isUserMentioned(user, message);

      expect(result).to.be.false;
    });

    it('returns true if user is mentioned', () => {
      let user = {
        profile: {name: 'test-user'},
      };
      let message = {
        text: 'hello, test-user',
      };

      let result = scope.isUserMentioned(user, message);

      expect(result).to.be.true;
    });
  });

  describe('postChat', () => {
    it('does not post an empty chat', () => {
      let group = {};
      let message = '';

      scope.postChat(group, message);

      expect(Chat.postChat).to.not.be.called;
    });

    it('posts a chat', () => {
      let group = {
        _id: 'test-id',
        chat: [],
      };
      let message = 'testing';
      Chat.postChat.returnsPromise({}).resolves({
        data: {
          data: {
            message: message,
          }
        }
      });

      scope.postChat(group, message);

      expect(Chat.postChat).to.be.calledOnce;
      expect(group.chat[0]).to.eql(message);
    });

    it('tracks party analytics', () => {
      let group = {
        _id: 'test-id',
        type: 'party',
        chat: [],
      };
      let message = 'testing';
      Chat.postChat.returnsPromise({}).resolves({
        data: {
          data: {
            chat: [message],
          }
        }
      });

      scope.postChat(group, message);

      expect(Chat.postChat).to.be.calledOnce;
      expect(Analytics.updateUser).to.be.calledOnce;
    });

    it('tracks public guild', () => {
      let group = {
        _id: 'test-id',
        type: 'guild',
        privacy: 'public',
        chat: [],
      };
      let message = 'testing';
      Chat.postChat.returnsPromise({}).resolves({
        data: {
          data: {
            chat: [message],
          }
        }
      });

      scope.postChat(group, message);

      expect(Chat.postChat).to.be.calledOnce;
      expect(Analytics.track).to.be.calledOnce;
    });

    it('posts a chat and updates chat', () => {
      let group = {
        _id: 'test-id',
        chat: [],
      };
      let message = 'testing';
      Chat.postChat.returnsPromise({}).resolves({
        data: {
          data: {
            chat: [message],
          }
        }
      });

      scope.postChat(group, message);

      expect(Chat.postChat).to.be.calledOnce;
      expect(group.chat[0]).to.eql(message);
    });

    it('posts a chat with previousMsg', () => {
      let group = {
        _id: 'test-id',
        chat: [{id: 'previous-id'}],
      };
      let message = 'testing';
      Chat.postChat.returnsPromise({}).resolves({});

      scope.postChat(group, message);

      expect(Chat.postChat).to.be.calledOnce;
      expect(Chat.postChat).to.be.calledWith(group._id, message, group.chat[0].id);
    });
  });

  describe('keyDownListener', () => {
    it('does not post chat if key is not enter', () => {
      let e = {};
      scope.postChat = sinon.spy();

      scope.keyDownListener(e);

      expect(scope.postChat).to.not.be.called;
    });

    it('does post chat if key is enter', () => {
      let e = {
        key: 'Enter',
        metaKey: 1,
      };
      scope.postChat = sinon.spy();

      scope.keyDownListener(e);

      expect(scope.postChat).to.be.calledOnce;
    });
  });

  describe('deleteChatMessage', () => {
    it('should delete chat', () => {
      let message = {
        id: 'test-id',
        uuid: User.user.id,
      };
      let group = {
        chat: [message],
      };
      sandbox.stub(window, 'confirm').returns(true);
      Chat.deleteChat.returnsPromise({}).resolves({});

      scope.deleteChatMessage(group, message);

      expect(Chat.deleteChat).to.be.calledOnce;
      expect(group.chat).to.eql([]);
    });

    it('should delete chat if user is admin', () => {
      let message = {
        id: 'test-id',
        uuid: User.user.id,
      };
      let group = {
        chat: [message],
      };
      sandbox.stub(window, 'confirm').returns(true);
      Chat.deleteChat.returnsPromise({}).resolves({});

      scope.deleteChatMessage(group, message);

      expect(Chat.deleteChat).to.be.calledOnce;
      expect(group.chat).to.eql([]);
    });

    it('should not delete chat if user cancels', () => {
      let message = {
        id: 'test-id',
      };
      let group = {
        chat: [message],
      };
      sandbox.stub(window, 'confirm').returns(false);
      Chat.deleteChat.returnsPromise({}).resolves({});

      scope.deleteChatMessage(group, message);

      expect(Chat.deleteChat).to.not.be.called;
      expect(group.chat).to.eql([message]);
    });

    it('should not delete chat if user is not owner', () => {
      let message = {
        id: 'test-id',
      };
      let group = {
        chat: [message],
      };
      Chat.deleteChat.returnsPromise({}).resolves({});

      scope.deleteChatMessage(group, message);

      expect(Chat.deleteChat).to.not.be.called;
      expect(group.chat).to.eql([message]);
    });
  });

  describe('likeChatMessage', () => {
    it('notifies user when they attempt to like their own user', () => {
      let group = {};
      let message = {
        uuid: User.user._id,
      };
      Chat.like.returnsPromise({}).resolves({});

      scope.likeChatMessage(group, message);

      expect(Chat.like).to.not.be.called;
      expect(Notification.text).to.be.calledOnce;
      expect(message.likes).to.not.exist;
    });

    it('likes a chat message', () => {
      let group = {};
      let message = {};
      Chat.like.returnsPromise({}).resolves({});

      scope.likeChatMessage(group, message);

      expect(Chat.like).to.be.calledOnce;
      expect(message.likes[User.user._id]).to.be.true;
    });

    it('unlikes a chat message', () => {
      let group = {};
      let message = {
        likes: [],
      };
      message.likes[User.user._id] = true;
      Chat.like.returnsPromise({}).resolves({});

      scope.likeChatMessage(group, message);

      expect(Chat.like).to.be.calledOnce;
      expect(message.likes[User.user._id]).to.be.empty;
    });
  });

  describe('flagChatMessage', () => {
    it ('opens abuse flag modal', () => {
      let groupId = 'group-id';
      let message = {};
      sandbox.stub($rootScope, 'openModal');

      scope.flagChatMessage(groupId, message);

      expect($rootScope.openModal).to.be.calledOnce;
    });

    it ('notifies user if abuse is already reported', () => {
      let groupId = 'group-id';
      let message = {
        flags: [],
      };
      message.flags[User.user._id] = true;

      scope.flagChatMessage(groupId, message);

      expect(Notification.text).to.be.calledOnce;
    });
  });

  describe('copyToDo', function() {
    it('when copying a user message it opens modal with information from message', function() {
      scope.group = {
        name: "Princess Bride"
      };

      var modalSpy = sandbox.spy($rootScope, "openModal");
      var message = {
        uuid: 'the-dread-pirate-roberts',
        user: 'Wesley',
        text: 'As you wish'
      };

      scope.copyToDo(message);

      modalSpy.should.have.been.calledOnce;

      modalSpy.should.have.been.calledWith('copyChatToDo', sinon.match(function(callArgToMatch){
        return callArgToMatch.controller == 'CopyMessageModalCtrl'
            && callArgToMatch.scope.text == message.text
      }));
    });

    it('when copying a system message it opens modal with information from message', function() {
      scope.group = {
        name: "Princess Bride"
      };

      var modalSpy = sandbox.spy($rootScope, "openModal");
      var message = {
        uuid: 'system',
        text: 'Wesley attacked the ROUS in the Fire Swamp'
      };

      scope.copyToDo(message);

      modalSpy.should.have.been.calledOnce;

      modalSpy.should.have.been.calledWith('copyChatToDo', sinon.match(function(callArgToMatch){
        return callArgToMatch.controller == 'CopyMessageModalCtrl'
            && callArgToMatch.scope.text == message.text
      }));
    });
  });

  describe('sync', () => {
    it('marks chat seen', () => {
      let group = {};
      User.user.party = {
        _id: 'party-id',
      };
      Groups.Group.get.returnsPromise({}).resolves({});

      scope.sync(group);

      expect(Chat.markChatSeen).to.be.calledOnce;
    });

    it('syncs tavern', () => {
      let group = {
        name: Groups.TAVERN_NAME,
      };
      Groups.tavern.returnsPromise({}).resolves({});

      scope.sync(group);

      expect(Chat.markChatSeen).to.be.calledOnce;
      expect(Groups.tavern).to.be.calledOnce;
    });

    it('syncs party', () => {
      let group = {
        _id: 'party-id',
      };
      User.user.party = {
        _id: 'party-id',
      };
      Groups.party.returnsPromise({}).resolves({});

      scope.sync(group);

      expect(Chat.markChatSeen).to.be.calledOnce;
      expect(Groups.party).to.be.calledOnce;
    });

    it('syncs a guild', () => {
      let group = {
      };
      User.user.party = {
        _id: 'party-id',
      };
      Groups.Group.get.returnsPromise({}).resolves({});

      scope.sync(group);

      expect(Chat.markChatSeen).to.be.calledOnce;
      expect(Groups.Group.get).to.be.calledOnce;
    });
  });
});
