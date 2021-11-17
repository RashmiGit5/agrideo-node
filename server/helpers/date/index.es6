import moment from 'moment-timezone';
import { GENERAL } from '../../config/general';

// moment.tz.add('Asia/Kolkata|LMT HMT MMT IST +0630|-5R.s -5R.k -5l.a -5u -6u|01234343|-4Fg5R.s BKo0.8 1rDcw.a 1r2LP.a 1un0 HB0 7zX0|15e6');

const getTimestamp = () => {
	let m = moment().tz(GENERAL.DEFAULT_TIMEZONE);
	m.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
	return m;
};

const parseTimestamp = (time) => {
	return moment.tz(time, GENERAL.DEFAULT_TIMEZONE).format();
};

const convertTimestamp = (time) => {
	return moment.tz(time, GENERAL.DEFAULT_TIMEZONE);
};

const isDateValid = (time) => {
	const date = moment.tz(time, GENERAL.DEFAULT_TIMEZONE);
	if (!date.isValid()) {
		return false;
	}
	return true;
};

const isDateNotFuture = (time) => {
	const nowTime = getTimestamp();
	return nowTime.isSameOrAfter(convertTimestamp(time));
};

const isDateNotBefore = (time) => {
	const nowTime = getTimestamp();
	return nowTime.isSameOrBefore(convertTimestamp(time));
};

const validDate = (time) => {
	return isDateValid(time);
};
const validDateNotFuture = (time) => {
	return isDateValid(time) && isDateNotFuture(time);
};
const validDateNotBefore = (time) => {
	return isDateValid(time) && isDateNotBefore(time);
};
const validTimestamp = (time) => {
	return isDateValid(time);
};
const validTimestampNotFuture = (time) => {
	return isDateValid(time) && isDateNotFuture(time);
};
const validTimestampNotBefore = (time) => {
	return isDateValid(time) && isDateNotBefore(time);
};

export default {
	validDate, validDateNotFuture, validDateNotBefore,
	validTimestamp, validTimestampNotFuture, validTimestampNotBefore, parseTimestamp
};