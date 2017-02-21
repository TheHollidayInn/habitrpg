'use strict';

describe('Menu Controller', function() {
  var scope, ctrl, user, $httpBackend, $window, Content,
    userBossQuest, userCollectQuest;

  beforeEach(function () {
    module(function($provide) {
      userBossQuest = {
        key: 'test-boss-key',
        boss: {
          name: 'boss',
        },
        text: function () {
          return 'title';
        },
      };

      userCollectQuest = {
        key: 'test-collect-key',
        collect: true,
        text: function () {
          return 'title';
        },
      };

      Content = {
        quests: {
        },
      };
      Content.quests[userBossQuest.key] = userBossQuest;
      Content.quests[userCollectQuest.key] = userCollectQuest;

      $provide.value('Chat', { seenMessage: function() {} });
      $provide.value('Content', Content);
    });

    inject(function(_$httpBackend_, $rootScope, $controller) {
      scope = $rootScope.$new();

      ctrl = $controller('MenuCtrl', {$scope: scope, $window: $window, User: user});
    })
  });

  describe('clearMessage', function() {
    it('is Chat.seenMessage', inject(function(Chat) {
      expect(scope.clearMessages).to.eql(Chat.markChatSeen);
    }));
  });

  describe('logout', () => {
    xit('clears localStorage', () => {
      sandbox.stub(window, 'localStorage');

      scope.logout();

      expect(localStorage.clear).to.be.called;
    });
  });

  describe('hasQuestProgress', () => {
    it('returns false by default', () => {
      scope.user = {
        party: {},
      };

      let result = scope.hasQuestProgress();

      expect(result).to.be.false;
    });

    it('returns false if quest quest does not exist', () => {
      scope.user = {
        party: {
          quest: {
            key: 'fake-key',
          },
        },
      };

      let result = scope.hasQuestProgress();

      expect(result).to.be.false;
    });

    it('returns true if boss quest', () => {
      scope.user = {
        party: {
          quest: {
            key: userBossQuest.key,
            progress: {
              up: 1,
            },
          },
        },
      };

      let result = scope.hasQuestProgress();

      expect(result).to.be.true;
    });

    it('returns true if collect quest', () => {
      scope.user = {
        party: {
          quest: {
            key: userCollectQuest.key,
            progress: {
              collectedItems: 1,
            },
          },
        },
      };

      let result = scope.hasQuestProgress();

      expect(result).to.be.true;
    });
  });

  describe('getQuestInfo', () => {
    it('returns empty', () => {
      scope.user = {
        party: {
        },
      };

      let result = scope.getQuestInfo();

      expect(result).to.be.empty;
    });

    it('returns quest info about a boss quest', () => {
      scope.user = {
        party: {
          quest: {
            key: userBossQuest.key,
            progress: {
              up: 1,
            },
          },
        },
      };

      let result = scope.getQuestInfo();

      expect(result.title).to.exist;
      expect(result.body).to.exist;
    });

    it('returns quest info about a collection quest', () => {
      scope.user = {
        party: {
          quest: {
            key: userCollectQuest.key,
            progress: {
              collectedItems: 1,
            },
          },
        },
      };

      let result = scope.getQuestInfo();

      expect(result.title).to.exist;
      expect(result.body).to.exist;
    });
  });

  describe('getNotificationsCount', () => {
    it('returns notifications count', () => {
      scope.user = {
        invitations: {
          party: {
            id: 'party-id',
          },
          guilds: {
            length: 1,
          }
        },
        purchased: {
          plan: {
            mysteryItems: {
              length: 1,
            }
          },
        },
        flags: {
          classSelected: true,
        },
        preferences: {
          disableClasses: false,
        },
        stats: {
          points: 1,
        },
        newMessages: [],
      };

      let count = scope.getNotificationsCount();

      expect(count).to.eql(4);
    });
  });

  describe('iconClasses', () => {
    it('returns glyphicon-gift if user has a new mystery item', () => {
      scope.user = {
        purchased: {
          plan: {
            mysteryItems: {
              length: 1,
            }
          },
        },
      }

      let result = scope.iconClasses();

      expect(result).to.eql('glyphicon-gift');
    });

    it('returns glyphicon-user if user has a group invitation', () => {
      scope.user = {
        invitations: {
          party: {
            id: 'party-id',
          },
          guilds: {
            length: 1,
          }
        },
      }

      let result = scope.iconClasses();

      expect(result).to.eql('glyphicon-user');
    });

    it('returns glyphicon-envelope if user has received a card', () => {
      scope.user = {
        flags: {
          cardReceived: true,
        },
        invitations: {
          party: {
          },
          guilds: {
          }
        },
      }

      let result = scope.iconClasses();

      expect(result).to.eql('glyphicon-envelope');
    });

    it('returns glyphicon-plus-sign if user has unallocatedValue', () => {
      scope.user = {
        flags: {
          classSelected: true,
        },
        preferences: {
          disableClasses: false,
        },
        stats: {
          points: 1,
        },
        invitations: {
          party: {
          },
          guilds: {
          }
        },
      }

      let result = scope.iconClasses();

      expect(result).to.eql('glyphicon-plus-sign');
    });

    it('returns glyphicon-comment if user has new messages', () => {
      scope.user = {
        newMessages: [{message: 'message'}],
        invitations: {
          party: {
          },
          guilds: {
          }
        },
        flags: {

        },
      };

      let result = scope.iconClasses();

      expect(result).to.eql('glyphicon-comment');
    });

    it('returns glyphicon-comment inactive by default', () => {
      scope.user = {
        invitations: {
          party: {
          },
          guilds: {
          }
        },
        flags: {

        },
      };

      let result = scope.iconClasses();

      expect(result).to.eql('glyphicon-comment inactive');
    });
  });

  describe('hasNoNotifications', () => {
    it('true when user has no notifications', () => {
      scope.user = {
        invitations: {
          party: {
          },
          guilds: {
          }
        },
        flags: {

        },
      };

      let result = scope.hasNoNotifications();

      expect(result).to.be.true;
    });
  });
});
