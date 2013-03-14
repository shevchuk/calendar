function Calendar(config) {
    this.view = null;
    this.bg = null;
    this.events = config.events;

    this.CALENDAR_WIDTH  = 600;
    this.CALENDAR_HEIGHT = 720;

    this.CALENDAR_PADDING = 10;
    this.TIMELINE_WIDTH = 60;
}

Calendar.prototype = {
    init: function() {
        this.view = document.createElement('div');
    },
    buildEventBlock: function(event) {
        var self = this;

        var eventBlock = document.createElement('div');
        eventBlock.style.position = 'absolute';
        eventBlock.style.backgroundColor = '#99ee99';

        eventBlock.style.width = px(this.CALENDAR_WIDTH / event.overlaps);
        eventBlock.style.height = px(event.end - event.start);

        var eventBlockInner = document.createElement('div');
        eventBlockInner.style.backgroundColor = '#ffffff';

        eventBlockInner.style.margin = '1px 1px 1px 0px';
        eventBlockInner.style.borderLeft = '4px solid #009900';

        eventBlockInner.style.height = px((event.end - event.start) - 2);
        eventBlock.appendChild(eventBlockInner);

        setContents();
        setEventPosition();

        function setContents() {
            if (event.overlaps > 15) {
                eventBlockInner.title = event.title;
            } else {
                eventBlockInner.innerHTML = event.title;
            }
            eventBlockInner.style.fontSize = px(11);

        }

        function setEventPosition() {
            eventBlock.style.marginTop = px(event.start);
            eventBlock.style.marginLeft = px((event.overlapIndex-1 )* (self.CALENDAR_WIDTH / event.overlaps));
        }

        return eventBlock;
    },
    buildBackground: function() {
        var bg = document.createElement('div');
        //bg.style.position = 'relative';
        bg.style.backgroundColor = '#eeeeee';
        bg.style.width = px(this.CALENDAR_WIDTH);
        bg.style.border = "1px solid grey";
        bg.style.height = px(this.CALENDAR_HEIGHT);

        bg.style.paddingLeft = px(this.CALENDAR_PADDING);
        bg.style.paddingRight = px(this.CALENDAR_PADDING);
        bg.style.float = 'left';
        bg.style.cssFloat = 'left';
        this.view.appendChild(bg);
        return bg;
    },
    buildTimeline: function() {
        var self = this;
        function getTimeScale() {
            return ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
                    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
        }

        var scale = getTimeScale();

        var timeline = document.createElement('div');
        timeline.style.height = px(this.CALENDAR_HEIGHT);
        timeline.style.width = px(this.TIMELINE_WIDTH);
        timeline.style.marginTop = px( - ( calculateScaleStepHeight() / 2));
        timeline.style.float = 'left';
        timeline.style.cssFloat = 'left';


        function calculateScaleStepHeight() {
            return ((self.CALENDAR_HEIGHT ) / scale.length + 1);
        }

        for (var i = 0; i < scale.length; i ++ ) {
            var p = document.createElement('div');
            p.style.height = px(calculateScaleStepHeight());
            p.style.lineHeight = p.style.height;
            p.style.fontWeight = i % 2 ? 'normal' : 'bold';
            p.style.fontSize = i % 2 ? '70%' : '100%' ;

            p.style.paddingRight = '10px';

            p.style.textAlign = 'right';

            p.style.marginTop = px(0);
            p.style.marginBottom = px(0);

            p.innerHTML = scale[i];
            timeline.appendChild(p)
        }

        this.view.appendChild(timeline);
    },
    buildEvents: function() {
        var eventMath = new EventsMath({events: this.events});


        eventMath.calculateIndices();
        eventMath.calculateOverlaps();

        var events  = eventMath.getEvents();

        for (var i = 0; i < this.events.length; i ++) {
            var block = this.buildEventBlock(this.events[i]);
            this.bg.appendChild(block);
        }
    },
    build: function(events) {
        this.buildTimeline();
        this.bg = this.buildBackground();
        this.buildEvents();


    },
    appendTo: function(dom) {
        this.init();
        this.build();

        dom.appendChild(this.view);
    }
}

function EventsMath(config) {
    this.events = config.events;
    this.eventStorage = null;
}

EventsMath.calculateBlockWidth = function(overlapNumber, containerWidth) {
    if (overlapNumber == 0) {
        return containerWidth;
    }

    return containerWidth / (overlapNumber + 1);
}

EventsMath.prototype = {
    calculateIndices: function() {
        var self = this;
        var eventStorage = null;

        function initOverlaps() {
            for (var k in self.events) {
                var event = self.events[k];
                event.overlapNumber = 0;
            }
        }

        function initMatrix() {
            eventStorage = [];
            eventStorage.push([]);
        }



        function sortEvents() {
            function putFirstEvent() {
                eventStorage[0].push(self.events[0]);
            }

            function createDeeperLevelAndPutEvent(event) {
                eventStorage.push([event]);
            }

            initMatrix();
            putFirstEvent();

            for (var i = 1; i < self.events.length; i++) {
                var event = self.events[i];

                for (var matrixDepth = 0; matrixDepth < eventStorage.length; matrixDepth++) {
                    var hasPlace = true;
                    for (var k = 0; k < eventStorage[matrixDepth].length; k++ ) {
                        if (eventsOverlap(event, eventStorage[matrixDepth][k])) {
                            hasPlace = false;
                        }
                    }
                    if (hasPlace) {
                        eventStorage[matrixDepth].push(event);
                        break;
                    }
                }
                if (!hasPlace) {
                    createDeeperLevelAndPutEvent(event);
                }
            }
        }

        function setIndices() {
            for (var i = 0; i < eventStorage.length; i ++) {
                for (var k = 0; k < eventStorage[i].length; k ++) {
                    eventStorage[i][k].overlapIndex = i + 1;
                }
            }
        }

        sortEvents();
        setIndices();

        this.eventStorage = eventStorage;
    },
    calculateOverlaps: function() {
        var self = this;
        var eventStorage = self.eventStorage;

        function overlapsWithColumn(index, event) {
            for (var i = 0; i < eventStorage[index].length; i++) {
                if (eventsOverlap(eventStorage[index][i], event)) {
                    return eventStorage[index][i];
                }
            }
            return false;
        }

        function shortenAreas() {
            for ( var depthIndex = 0; depthIndex <  eventStorage.length; depthIndex++ ) {
                for ( var eventIndex = 0; eventIndex < eventStorage[depthIndex].length; eventIndex++ ) {
                    var event = eventStorage[depthIndex][eventIndex];

                    for (var columnIndex = 0; columnIndex < eventStorage.length; columnIndex++ ) {
                        if (depthIndex != columnIndex) {
                            var overlapped = overlapsWithColumn(columnIndex, event);
                            if (overlapped) {
                                if (overlapped.overlaps > event.overlaps ) {
                                    event.overlaps = overlapped.overlaps;
                                }
                            }
                        }
                    }
                }
            }
        }

        function setInitialOverlaps() {
            for ( var depthIndex = 0; depthIndex <  eventStorage.length; depthIndex++ ) {
                for ( var eventIndex = 0; eventIndex < eventStorage[depthIndex].length; eventIndex++ ) {
                    var event = eventStorage[depthIndex][eventIndex];
                    // init event overlap
                    event.overlaps = 1;
                    // go through all columns and check overlaps
                    for (var columnIndex = 0; columnIndex < eventStorage.length; columnIndex++ ) {
                        if (depthIndex != columnIndex) {
                            if (overlapsWithColumn(columnIndex, event)) {
                                event.overlaps ++;
                            }
                        }
                    }
                }
            }
        }

        setInitialOverlaps();
        shortenAreas();
    },
    getEvents: function() {
        return this.events;
    }
}

function eventsOverlap(event1, event2) {
    if ((event1.start >= event2.start) &&
        (event1.start < event2.end)) {
        return true;
    } else if ((event2.start >= event1.start) &&
        (event2.start < event1.end))
    {
        return true;
    } else {
        return false;
    }
}
function px(value) {
    return value + 'px';
}