export function formatDate(date, ignoreHour = false) {
    let dateParts = date.toLocaleDateString().split('/');
    if (ignoreHour) {
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    }
    let hour = date.getHours();
    let minute = date.getMinutes();
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${hour}:${minute}:0`
}

export function compareHours(a, b) {
    let baseDate = new Date(0);
    const [h1, m1] = a.split(':');
    const [h2, m2] = b.split(':');
    let hour1 = new Date(baseDate);
    let hour2 = new Date(baseDate);

    hour1.setHours(h1, m1)
    hour2.setHours(h2, m2)

    if (hour1 < hour2) {
        return -1;
    }
    if (hour1 > hour2) {
        return 1;
    }
    return 0;
}