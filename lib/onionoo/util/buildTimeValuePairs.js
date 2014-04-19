var moment = require('moment').utc;

module.exports = function(historyObject){
    if(historyObject.first && historyObject.last && historyObject.interval){
        var startDate = moment(historyObject.first, 'YYYY-MM-DD HH:mm:ss'),
            endDate = moment(historyObject.last, 'YYYY-MM-DD HH:mm:ss');

        // check if Date creation was successfull
        if(!isNaN(startDate.valueOf()) && !isNaN(endDate.valueOf())){
            // everything worked

            var sum = 0,
                newValues = [],
                values = historyObject.values,
            // interval is in seconds, multiply 1000 to get millisecs
                interval = historyObject.interval * 1000,
                currentTime = startDate.valueOf();

            for(var i = 0, max = values.length; i < max; i++){
                var realValue = values[i] * historyObject.factor;

                newValues.push([
                    currentTime,
                    realValue
                ]);

                sum += realValue;
                currentTime += interval;
            }

            historyObject.avg = (sum / values.length);
            historyObject.values = newValues;

        }else{
            throw 'There was an error parsing the history object timestamps. Check if ' + historyObject.first + ' or ' + historyObject.last + ' are correct.';
        }

    }else{
        throw 'Cannot generate time value pairs if there is no time interval given';
    }

    return historyObject;
};