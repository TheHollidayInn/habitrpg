'use strict';

describe('MemberModal Controller', function() {
  var scope, ctrl, user, $location, $rootScope,
    Members, User, Chat, Notification;

  beforeEach(function () {
    module(function($provide) {
      User = {
        user: {
          preferences: {
            dateFormat: '',
          }
        },
      };

      Members = {
        sendPrivateMessage: sandbox.stub(),
        transferGems: sandbox.stub(),
      };

      Chat = {
        flagChatMessage: sandbox.stub(),
        clearFlagCount: sandbox.stub(),
      };

      Notification = {
        text: sandbox.stub(),
      };

      $provide.value('User', User);
      $provide.value('Members', Members);
      $provide.value('Chat', Chat);
      $provide.value('Notification', Notification);
    });

    inject(function(_$rootScope_, _$controller_, _$location_) {
      scope = _$rootScope_.$new();
      scope.$close = sandbox.stub();

      $rootScope = _$rootScope_;

      $location = _$location_;

      // Load RootCtrl to ensure shared behaviors are loaded
      _$controller_('RootCtrl',  {$scope: scope, User: User});

      ctrl = _$controller_('MemberModalCtrl', {$scope: scope});
    });
  });

  describe('timestamp', () => {
    it('formats a timestamp', () => {
      let timestamp = 'timestamp';
      let momentFormatStub = sandbox.stub(window.moment.prototype, 'format');

      scope.timestamp(timestamp);

      expect(momentFormatStub).to.be.calledOnce;
    });
  });

  describe('keyDownListener', () => {
    it('sends private message on enter', () => {
      let e = {
        key: 'Enter',
        metaKey: 1,
      };
      scope.profile = {
        _id: 'test-id',
      };
      let sendPrivateMessageStub = sandbox.stub(scope, 'sendPrivateMessage');

      scope.keyDownListener(e);

      expect(sendPrivateMessageStub).to.be.calledOnce;
    });

    it('does not send private message if key is not enter', () => {
      let e = {
        key: '',
      };
      let sendPrivateMessageStub = sandbox.stub(scope, 'sendPrivateMessage');

      scope.keyDownListener(e);

      expect(sendPrivateMessageStub).to.not.be.called;
    });
  });

  describe('sendPrivateMessage', () => {
    it('sends a private message', () => {
      let uuid = 'uuid-example';
      let message = 'message-example';
      Members.sendPrivateMessage.returnsPromise({}).resolves({});

      scope.sendPrivateMessage(uuid, message);

      expect(Members.sendPrivateMessage).to.be.calledOnce;
    });

    it('does not send empty private message', () => {
      let uuid = 'uuid-example';
      let message = '';
      Members.sendPrivateMessage.returnsPromise({}).resolves({});

      scope.sendPrivateMessage(uuid, message);

      expect(Members.sendPrivateMessage).to.not.be.called;
    });
  });

  describe('sendGift', () => {
    it('transfers gems', () => {
      let uuid = 'uuid-example';
      Members.transferGems.returnsPromise({}).resolves({});

      scope.sendGift(uuid);

      expect(Members.transferGems).to.be.calledOnce;
    });
  });

  describe('reportAbuse', () => {
    it('flags a chat message', () => {
      let reporter = 'reporter-example';
      let groupId = 'groupId-example';
      let message = {
        id: 'message-id',
      };
      Chat.flagChatMessage.returnsPromise({}).resolves({
        data: {
          data: {
            flags: [],
            flagCount: 0,
          },
        }
      });

      scope.reportAbuse(reporter, message, groupId);

      expect(Chat.flagChatMessage).to.be.calledOnce;
    });
  });

  describe('clearFlagCount', () => {
    it('clears a flag count', () => {
      let groupId = 'groupId-example';
      let message = {
        id: 'message-id',
        flagCount: 1,
      };
      Chat.clearFlagCount.returnsPromise({}).resolves({});

      scope.clearFlagCount(groupId, message);

      expect(Chat.clearFlagCount).to.be.calledOnce;
    });
  });
});
