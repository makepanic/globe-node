var moment = require('moment').utc;

module.exports = function(historyObject){
    if(historyObject.first && historyObject.last && historyObject.interval){

        var startDate = moment(historyObject.first, 'YYYY-MM-DD HH:mm:ss'),
            endDate = moment(historyObject.last, 'YYYY-MM-DD HH:mm:ss');


        // check if Date creation was successfull
        if(!isNaN(startDate.valueOf()) && !isNaN(endDate.valueOf())){
            // everything worked

            var newValues = [];
            var values = historyObject.values;

            // interval is in seconds, multiply 1000 to get millisecs
            var interval = historyObject.interval * 1000;

            var currentTime = startDate.valueOf();

            for(var i = 0, max = values.length; i < max; i++){

                newValues.push([
                    currentTime,
                    values[i] * historyObject.factor
                ]);
                currentTime += interval;
            }

            historyObject.values = newValues;

        }else{
            throw 'There was an error parsing the history object timestamps. Check if ' + historyObject.first + ' or ' + historyObject.last + ' are correct.';
        }

    }else{
        throw 'Cannot generate time value pairs if there is no time interval given';
    }

    return historyObject;
};