import moment from 'moment';

function isoToLocalDateString(stringDate) {
    return moment.utc(stringDate).local().format('llll');
}

function msToTime(duration) {
    const milliseconds = parseInt((duration % 1000) / 100);
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return [hours, minutes, seconds, milliseconds];
}

function addDurationToString(isoString, durationMillisecond) {
    return moment(isoString).add(durationMillisecond, 'ms').toISOString();
}

function isDateObject(date) {
    return date && typeof date.getMonth === 'function';
}

export {isoToLocalDateString, msToTime, addDurationToString, isDateObject}
