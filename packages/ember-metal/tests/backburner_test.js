var Backburner = Ember.Backburner;

module("Backburner");

test("run when passed a function", function() {
  expect(1);

  var bb = new Backburner(),
      functionWasCalled = false;

  bb.run(function() {
    functionWasCalled = true;
  });

  ok(functionWasCalled, "function was called");
});

test("run when passed a target and method", function() {
  expect(2);

  var bb = new Backburner(),
      functionWasCalled = false;

  bb.run({zomg: "hi"}, function() {
    equal(this.zomg, "hi", "the target was properly set");
    functionWasCalled = true;
  });

  ok(functionWasCalled, "function was called");
});

test("run when passed a target, method, and arguments", function() {
  expect(5);

  var bb = new Backburner(),
      functionWasCalled = false;

  bb.run({zomg: "hi"}, function(a, b, c) {
    equal(this.zomg, "hi", "the target was properly set");
    equal(a, 1, "the first arguments was passed in");
    equal(b, 2, "the second arguments was passed in");
    equal(c, 3, "the third arguments was passed in");
    functionWasCalled = true;
  }, 1, 2, 3);

  ok(functionWasCalled, "function was called");
});

test("next when passed a function", function() {
  expect(1);

  var bb = new Backburner();

  bb.next(function() {
    start();
    ok(true, "function was called");
  });

  stop();
});


test("actions scheduled on previous queue, start over from beginning", function() {
  expect(5);

  var bb = new Backburner(['one', 'two']),
      step = 0;

  bb.run(function() {
    equal(step, 0, "0");
    step++;

    bb.schedule('two', null, function() {
      equal(step, 1, "1");
      step++;

      bb.schedule('one', null, function() {
        equal(step, 2, "2");
        step++;
      });
    });

    bb.schedule('two', null, function() {
      equal(step, 3, "3");
      step++;
    });
  });

  equal(step, 4, "4");
});

test("runs can be nested", function() {
  expect(2);

  var bb = new Backburner();

  bb.run(function() {
    ok(true);

    bb.run(function() {
      ok(true);
    });
  });
});
