module("calendar test");
testCalendarMath();

var eventMap1 = {
    events  : [
        { id: 1,        start: 30 ,     end: 150,       title: 'Event1' },
        { id: 2,        start: 540,     end: 600,       title: 'Event2' },
        { id: 3,        start: 560,     end: 620,       title: 'Event3' },
        { id: 4,        start: 610,     end: 670,       title: 'Event4' }
    ]
};

var eventMap2 = {
    events : [
        { id: 1,        start: 30 ,     end: 150,       title: 'Event1' },
        { id: 2,        start: 540,     end: 600,       title: 'Event2' },
        { id: 3,        start: 560,     end: 620,       title: 'Event3' },
        { id: 4,        start: 610,     end: 670,       title: 'Event4' },
        { id: 5,        start: 610,     end: 670,       title: 'Event5' }
    ]
};

var eventMap3 = {
    events: [
        { id: 1,        start: 30 ,     end: 150,       title: 'Event1' },
        { id: 2,        start: 140,     end: 160,       title: 'Event2' },
        { id: 3,        start: 160,     end: 220,       title: 'Event3' },
        { id: 4,        start: 510,     end: 570,       title: 'Event4' },
        { id: 5,        start: 110,     end: 170,       title: 'Event5' },
        { id: 6,        start: 530 ,    end: 550,       title: 'Event6' }
    ]
};

function testCalendarMath() {
    test("Checking overlaps", function() {
        var eventMath = new EventsMath(eventMap1);

        eventMath.calculateIndices();
        var events  = eventMath.getEvents();

        ok(events[0].id == 1, "Event id check");
        equal(events[0].overlapIndex, 1, 'Check overlap number 1');

        equal(events[1].id, 2, 'Check second event id 2');
        equal(events[1].overlapIndex, 1, 'Check overlap number 2');

        equal(events[2].id, 3, 'Check second event id 3');
        equal(events[2].overlapIndex, 2, 'Check overlap number 3');

        equal(events[3].id, 4, 'Check second event id 3');
        equal(events[3].overlapIndex, 1, 'Check overlap number 3');
    });

    test("Checking block width calculations", function() {
        equal(EventsMath.calculateBlockWidth(0, 600), 600, 'Check overlap with no events');
        equal(EventsMath.calculateBlockWidth(1, 600), 300, 'Check overlap with 1 event');
        equal(EventsMath.calculateBlockWidth(2, 600), 200, 'Check overlap with 2 events');
    });

    test("Checking overlap calculations 1 ", function() {
        var eventMath = new EventsMath(eventMap1);
        eventMath.calculateIndices();
        eventMath.calculateOverlaps();
        var events  = eventMath.getEvents();

        equal(events[0].overlaps, 1, 'Check overlaps for 0');
        equal(events[1].overlaps, 2, 'Check overlaps for 1');
        equal(events[2].overlaps, 2, 'Check overlaps for 2');
        equal(events[3].overlaps, 2, 'Check overlaps for 3');
    });

    test("Checking overlap calculations 2 ", function() {
        var eventMath = new EventsMath(eventMap2);
        eventMath.calculateIndices();
        eventMath.calculateOverlaps();
        var events  = eventMath.getEvents();

        equal(events[0].id, 1, 'Check second event id 2');
        equal(events[0].overlapIndex, 1, 'Check overlap number 1');

        equal(events[1].id, 2, 'Check second event id 2');
        equal(events[1].overlapIndex, 1, 'Check overlap number 2');

        equal(events[2].id, 3, 'Check second event id 3');
        equal(events[2].overlapIndex, 2, 'Check overlap number 3');

        equal(events[3].id, 4, 'Check second event id 4');
        equal(events[3].overlapIndex, 1, 'Check overlap number 4');

        equal(events[4].id, 5, 'Check second event id 5');
        equal(events[4].overlapIndex, 3, 'Check overlap number 5');


        equal(events[0].overlaps, 1, 'Check overlaps for 0');
        equal(events[1].overlaps, 3, 'Check overlaps for 1');
        equal(events[2].overlaps, 3, 'Check overlaps for 2');
        equal(events[3].overlaps, 3, 'Check overlaps for 3');
        equal(events[4].overlaps, 3, 'Check overlaps for 4');
    });

    test("Checking overlap calculations 3 ", function() {
        var eventMath = new EventsMath(eventMap3);
        eventMath.calculateIndices();
        eventMath.calculateOverlaps();
        var events  = eventMath.getEvents();

        equal(events[0].id, 1, 'Check second event id 2');
        equal(events[0].overlapIndex, 1, 'Check overlap number 1');

        equal(events[1].id, 2, 'Check second event id 2');
        equal(events[1].overlapIndex, 2, 'Check overlap number 2');

        equal(events[2].id, 3, 'Check second event id 3');
        equal(events[2].overlapIndex, 1, 'Check overlap number 3');

        equal(events[3].id, 4, 'Check second event id 4');
        equal(events[3].overlapIndex, 1, 'Check overlap number 4');

        equal(events[4].id, 5, 'Check second event id 5');
        equal(events[4].overlapIndex, 3, 'Check overlap number 5');

        equal(events[5].id, 6, 'Check second event id 6');
        equal(events[5].overlapIndex, 2, 'Check overlap number 6');


        equal(events[0].overlaps, 3, 'Check overlaps for 0');
        equal(events[1].overlaps, 3, 'Check overlaps for 1');
        equal(events[2].overlaps, 3, 'Check overlaps for 2');
        equal(events[3].overlaps, 2, 'Check overlaps for 3');
        equal(events[4].overlaps, 3, 'Check overlaps for 4');
        equal(events[5].overlaps, 2, 'Check overlaps for 5');
    });
}
