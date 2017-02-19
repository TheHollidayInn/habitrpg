describe('GroupTasks Controller', () => {
  let rootScope, scope, Tasks, User;

  beforeEach(() => {
    module(function($provide) {
      Tasks = {
        editTask: sandbox.stub(),
        addTasks: sandbox.stub(),
        getGroupTasks: sandbox.stub(),
        createGroupTasks: sandbox.stub(),
        removeTask: sandbox.stub(),
        deleteTask: sandbox.stub(),
        saveTask: sandbox.stub(),
        updateTask: sandbox.stub(),
        addChecklistItem: sandbox.stub(),
        addChecklistItemToUI: sandbox.stub(),
        removeChecklistItem: sandbox.stub(),
        removeChecklistItemFromUI: sandbox.stub(),
        addTagToTask: sandbox.stub(),
        removeTagFromTask: sandbox.stub(),
        collapseChecklist: sandbox.stub(),
      };

      User = {
        user: {
          _id: 'id-user',
        },
      };

      $provide.value('Tasks', Tasks);
      $provide.value('User', User);
    });

    inject(($rootScope, $controller) => {
      rootScope = $rootScope;

      scope = $rootScope.$new();
      scope.group = scope.obj = {
        _id: 'group-id',
        tasks: [],
      };

      $controller('GroupTasksCtrl', {$scope: scope});
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('does not refresh tasks if there is an empty response', function () {
    var tasks = [];
    Tasks.getGroupTasks.returnsPromise().resolves({
      data: {
        data: tasks,
      },
    });

    scope.refreshTasks();

    expect(Tasks.getGroupTasks).to.be.called;
    expect(scope.group['habits']).to.not.exist;
  });

  it('refreshes tasks', function () {
    var tasks = [{
      type: 'habit',
    }];
    Tasks.getGroupTasks.returnsPromise().resolves({
      data: {
        data: tasks,
      },
    });

    scope.refreshTasks();

    expect(Tasks.getGroupTasks).to.be.called;
    expect(scope.group['habits']).to.eql(tasks);
  });

  it('calls the task service edit task', function () {
    Tasks.editTask.returnsPromise().resolves({});

    scope.editTask();

    expect(Tasks.editTask).to.be.called;
  });

  it('adds tasks', function () {
    let listDef = {
      type: 'habit',
    };
    let taskTexts = ['task1'];
    Tasks.addTasks.yields(listDef, taskTexts);
    Tasks.createGroupTasks.returnsPromise().resolves({});
    scope.group['habits'] = undefined;

    scope.addTask();

    expect(Tasks.addTasks).to.be.called;
    expect(Tasks.createGroupTasks).to.be.called
  });

  it('does nothing if group is not defined', function () {
    let listDef = {
      type: 'habit',
    };
    let taskTexts = ['task1'];
    Tasks.addTasks.yields(listDef, taskTexts);
    Tasks.createGroupTasks.returnsPromise().resolves({});
    scope.group._id = undefined;

    scope.addTask();

    expect(Tasks.addTasks).to.be.called;
    expect(Tasks.createGroupTasks).to.not.be.called
  });

  it('removes a task', function () {
    let task = {
      type: 'habit',
    }
    scope.group[`${task.type}s`] = [task];
    Tasks.removeTask.returns(true);
    Tasks.deleteTask.returnsPromise().resolves({});

    scope.removeTask(task, scope.group);

    expect(Tasks.removeTask).to.be.called;
    expect(Tasks.deleteTask).to.be.called
    // @TODO: for some reason the scope is altered during manual test but not here. Must be misunderstanding digest
    // expect(scope.group[`${task.type}s`]).to.be.empty();
  });

  it('does not remove a task if Task.removeTask is false', function () {
    let task = {
      type: 'habit',
    }
    scope.group[`${task.type}s`] = [task];
    Tasks.removeTask.returns(false);
    Tasks.deleteTask.returnsPromise().resolves({});

    scope.removeTask(task, scope.group);

    expect(Tasks.removeTask).to.be.called;
    expect(Tasks.deleteTask).to.not.be.called
    expect(scope.group[`${task.type}s`]).to.eql([task]);
  });

  it('does not call Task.deleteTask if group id is not defined', function () {
    let task = {
      type: 'habit',
    }
    scope.group[`${task.type}s`] = [task];
    scope.group._id = undefined;
    Tasks.removeTask.returns(true);
    Tasks.deleteTask.returnsPromise().resolves({});

    scope.removeTask(task, scope.group);

    expect(Tasks.removeTask).to.be.called;
    expect(Tasks.deleteTask).to.not.be.called
    // @TODO: for some reason the scope is altered during manual test but not here. Must be misunderstanding digest
    // expect(scope.group[`${task.type}s`]).to.be.empty();
  });

  it('saves a task', function () {
    let task = {
      type: 'habit',
    };
    task._edit = {
      checklist: undefined,
    };
    let stayOpen = false;
    let isSaveAndClose = false;

    scope.saveTask(task, stayOpen, isSaveAndClose);

    expect(Tasks.saveTask).to.be.called;
    expect(Tasks.updateTask).to.be.called
  });

  it('saves a task and adds a checklist', function () {
    let task = {
      type: 'habit',
      checklist: [],
    };
    task._edit = {
      checklist: [{
        text: 'test checklist',
      }],
    };
    let stayOpen = false;
    let isSaveAndClose = false;
    Tasks.addChecklistItem.returnsPromise().resolves({
      data: {
        data: {
          checklist: [{
            text: 'test checklist',
          }]
        },
      },
    });

    scope.saveTask(task, stayOpen, isSaveAndClose);

    expect(Tasks.saveTask).to.be.called;
    expect(Tasks.updateTask).to.be.called;
    expect(Tasks.addChecklistItem).to.be.called;
  });

  it('saves a task and does not add a checklist with an id', function () {
    let task = {
      type: 'habit',
      checklist: [],
    };
    task._edit = {
      checklist: [{
        text: 'test checklist',
        id: 'example-id',
      }],
    };
    let stayOpen = false;
    let isSaveAndClose = false;

    scope.saveTask(task, stayOpen, isSaveAndClose);

    expect(Tasks.saveTask).to.be.called;
    expect(Tasks.updateTask).to.be.called;
    expect(Tasks.addChecklistItem).to.not.be.called;
  });

  it('should show should return true', function () {
    let result = scope.shouldShow();

    expect(result).to.be.true;
  });

  it('can edit should return true', function () {
    let result = scope.canEdit();

    expect(result).to.be.true;
  });

  it('adds a tag to a task', function () {
    let tagId = '123';
    let task = {
     type: 'habit',
     tags: [],
    };

    scope.updateTaskTags(tagId, task);

    expect(Tasks.addTagToTask).to.be.called;
    expect(task.tags).to.eql([tagId]);
  });

  it('removes a tag from a task', function () {
    let tagId = '123';
    let task = {
     type: 'habit',
     tags: [tagId],
    };

    scope.updateTaskTags(tagId, task);

    expect(Tasks.removeTagFromTask).to.be.called;
    expect(task.tags).to.eql([]);
  });

  it('adds a checklist item', function () {
    let task = {
     type: 'habit',
    };
    task._edit = {
      checklist: [{
        text: 'test checklist',
      }],
    };
    Tasks.addChecklistItem.returnsPromise().resolves({
      data: {
        data: {
          checklist: [{
            text: 'test checklist',
          }]
        },
      },
    });

    scope.addChecklistItem(task, null, 0);

    expect(Tasks.addChecklistItem).to.be.called;
    expect(Tasks.addChecklistItemToUI).to.be.called;
  });

  it('does nothing if checklist was just added', function () {
    let task = {
     type: 'habit',
    };
    task._edit = {
      checklist: [{
        text: 'test checklist',
        justAdded: true,
      }],
    };

    scope.addChecklistItem(task, null, 0);

    expect(Tasks.addChecklistItem).to.not.be.called;
    expect(Tasks.addChecklistItemToUI).to.not.be.called;
  });

  it('does not add a checklist item if item as id', function () {
    let task = {
     type: 'habit',
    };
    task._edit = {
      checklist: [{
        text: 'test checklist',
        id: 'id',
      }],
    };

    scope.addChecklistItem(task, null, 0);

    expect(Tasks.addChecklistItem).to.not.be.called;
    expect(Tasks.addChecklistItemToUI).to.be.called;
  });

  it('removes a checklist item', function () {
    let task = {
     type: 'habit',
    };
    task._edit = {
      checklist: [{
        text: 'test checklist',
        id: 'id',
      }],
    };

    scope.removeChecklistItem(task, null, 0);

    expect(Tasks.removeChecklistItem).to.be.called;
    expect(Tasks.removeChecklistItemFromUI).to.be.called;
  });

  it('does not remove a checklist item when id is empty', function () {
    let task = {
     type: 'habit',
    };
    task._edit = {
      checklist: [{
        text: 'test checklist',
        id: undefined,
      }],
    };

    scope.removeChecklistItem(task, null, 0);

    expect(Tasks.removeChecklistItem).to.not.be.called;
    expect(Tasks.removeChecklistItemFromUI).to.not.be.called;
  });

  it('collapses the checklist', function () {
    let task = {
     type: 'habit',
    };

    scope.collapseChecklist(task);

    expect(Tasks.collapseChecklist).to.be.called;
    expect(Tasks.updateTask).to.be.called;
  });

  it('returns true for group access', function () {
    scope.group.leader = {
      _id: 'id-user',
    };
    let result = scope.checkGroupAccess(scope.group);

    expect(result).to.be.true;
  });

  it('returns true when group leader does not exist', function () {
    let result = scope.checkGroupAccess(scope.group);

    expect(result).to.be.true;
  });

  it('returns false when user is not leader', function () {
    scope.group.leader = {
      _id: 'leader-id',
    };
    let result = scope.checkGroupAccess(scope.group);

    expect(result).to.be.false;
  });

  it('returns empty popover when task popover is true', function () {
    let task = {
      popoverOpen: true,
    };
    let result = scope.taskPopover(task);

    expect(result).to.eql('');
  });

  it('returns task notes when task popover is empty', function () {
    let task = {
      popoverOpen: false,
      notes: 'test-notes',
    };
    scope.group = undefined;
    let result = scope.taskPopover(task);

    expect(result).to.be.eql('test-notes');
  });

  it('return list of claimed users', function () {
    let notes = '';
    let task = {
      popoverOpen: false,
      notes,
      group: {},
    };
    scope.group.members = [{
      id: 'member-id',
      profile: {
        name: 'member-name',
      },
    }];
    task.group.assignedUsers = ['member-id'];
    let claimingUsers = ['"member-name"'];
    let result = scope.taskPopover(task);

    expect(result).to.be.eql(window.env.t('claimedBy', {claimingUsers: claimingUsers.join(', ')}));
  });

  it('return list of claimed users', function () {
    let notes = '';
    let task = {
      popoverOpen: false,
      notes,
      group: {},
    };
    scope.group.members = [{
      id: 'member-id',
      profile: {
        name: 'member-name',
      },
    }];
    task.group.assignedUsers = [];
    let claimingUsers = ["member-id"];
    let result = scope.taskPopover(task);

    expect(result).to.be.eql('');
  });
});
