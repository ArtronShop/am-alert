export function formatFacebookTimeTH(date: Date): string {
	const now = new Date();
	const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // ความต่างเป็นวินาที

	if (diff < 60) return "เมื่อสักครู่";
	if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;

	// ตรวจสอบว่าเป็นเมื่อวานไหม
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const isYesterday = date.toDateString() === yesterday.toDateString();
	if (isYesterday) return "เมื่อวานนี้";

	// ถ้าเป็นปีเดียวกัน
	const isThisYear = date.getFullYear() === now.getFullYear();
	const options: Intl.DateTimeFormatOptions = isThisYear
		? { day: "numeric", month: "short" }
		: { day: "numeric", month: "short", year: "numeric" };

	return date.toLocaleDateString("th-TH", options);
}
