describe('Group Approvals Controller', () => {
  let rootScope, scope, Tasks;

  beforeEach(() => {
    module(function($provide) {
      Tasks = {
        approve: sandbox.stub(),
        getGroupApprovals: sandbox.stub(),
      };
      $provide.value('Tasks', Tasks);
    });

    inject(($rootScope, $controller) => {
      rootScope = $rootScope;

      scope = $rootScope.$new();
      scope.group = {
        approvals: [],
      };

      $controller('GroupApprovalsCtrl', {$scope: scope});
    });
  });

  it('does nothing when approval is denied', function () {
    sinon.stub(window, 'confirm').returns(false);

    scope.approve();

    expect(Tasks.approve).to.not.be.called;
    window.confirm.restore();
  });

  it('approves task when confirm is true', function () {
    sinon.stub(window, 'confirm').returns(true);
    Tasks.approve.returnsPromise().resolves({});

    scope.approve();

    expect(Tasks.approve).to.be.called;
    window.confirm.restore();
  });

  it('returns approval title', function () {
    var approval = {
      text: 'test',
      userId: {
        profile: {
          name: 'test-name',
        },
      },
    };
    var title = window.env.t('approvalTitle', {text: approval.text, userName: approval.userId.profile.name});

    var approvalTitle = scope.approvalTitle (approval);

    expect(approvalTitle).to.eql(title);
  });

  it('refreshes approvals', function () {
    var approvals = ['test-approval'];
    Tasks.getGroupApprovals.returnsPromise().resolves({
      data: {
        data: approvals,
      },
    });

    scope.refreshApprovals();

    expect(Tasks.getGroupApprovals).to.be.called;
    expect(scope.group.approvals).to.eql(approvals)
  });

  it('does not refresh approvals if they are empty', function () {
    scope.group.approvals = [];
    Tasks.getGroupApprovals.returnsPromise().resolves(undefined);

    scope.refreshApprovals();

    expect(Tasks.getGroupApprovals).to.be.called;
    expect(scope.group.approvals).to.eql([]);
  });
});
