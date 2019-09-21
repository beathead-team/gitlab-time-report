// the idea of the parsing came from https://github.com/zubroide/gitpab/blob/master/app/Model/Service/Eloquent/EloquentNoteService.php
const SPENT_TIME_NOTE_PATTERN = /(added|subtracted) ((?:(?:\d{1,3}[wdhms])\s+)+)of time spent at (\d{4}-\d{2}-\d{2})/;

export function parseTime(time) {
    const value = time.substr(0, time.length - 1);
    const period = time.substr(time.length - 1);
    switch (period) {
        case 's':
            return value / 3600;
        case 'm':
            return value / 60;
        case 'h':
            return value;
        case 'd':
            return value * 8;
        case 'w':
            return value * 8 * 5;
        default:
            throw new Error(`Unknown issue note period of time = ${period}, time = ${time}`);
    }
}

export function parseIssueNotesSpentTime(notes) {
    return notes.reduce((previousSpentTimeSet, currentNote, currentIndex, allNotes) => {
        const matches = SPENT_TIME_NOTE_PATTERN.exec(currentNote.body);
        let spentAt = null;
        let hours = 0;
        if (!!matches && matches.length === 4) {
            const sign = matches[1] === 'added' ? 1 : -1;
            const times = matches[2].split(' ').filter(x => !!x);
            hours = times.reduce((previousValue, currentValue) => previousValue + sign * parseTime(currentValue.trim()), 0);
            spentAt = matches[3];
        }

        let description = null;
        if (currentIndex > 0) {
            const prevNote = allNotes[currentIndex - 1];
            const date1 = new Date(prevNote.created_at);
            date1.setSeconds(date1.getSeconds() + 10);
            const date2 = new Date(currentNote.created_at);
            if (prevNote.author.id === currentNote.author.id
                && prevNote.noteable_iid === currentNote.noteable_iid
                && date1 > date2) {
                description = prevNote.body;
            }
        }

        return hours > 0 ? previousSpentTimeSet.concat([{
            note_id: currentNote.id,
            spent_at: spentAt,
            created_at: currentNote.created_at,
            hours,
            description
        }]) : previousSpentTimeSet;
    }, []);
}
