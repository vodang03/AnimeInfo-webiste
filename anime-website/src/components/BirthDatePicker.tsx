"use client";

import { useState, useEffect } from "react";

interface BirthDatePickerProps {
  value: string; // ngày sinh dạng 'yyyy-mm-dd' hoặc ''
  onChange: (value: string) => void;
}

export default function BirthDatePicker({
  value,
  onChange,
}: BirthDatePickerProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Hàm tạo mảng số
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const days31 = range(1, 31);
  const months = [
    { value: "01", label: "Tháng 1" },
    { value: "02", label: "Tháng 2" },
    { value: "03", label: "Tháng 3" },
    { value: "04", label: "Tháng 4" },
    { value: "05", label: "Tháng 5" },
    { value: "06", label: "Tháng 6" },
    { value: "07", label: "Tháng 7" },
    { value: "08", label: "Tháng 8" },
    { value: "09", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];
  const currentYear = new Date().getFullYear();
  const years = range(currentYear - 100, currentYear);

  // Cập nhật day/month/year khi value prop thay đổi (ví dụ edit form)
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-");
      setYear(y);
      setMonth(m);
      setDay(d);
    }
  }, [value]);

  // Kiểm tra số ngày của tháng (để lọc ngày hợp lệ)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Lọc ngày theo tháng-năm đang chọn
  const daysInSelectedMonth =
    year && month
      ? range(1, getDaysInMonth(parseInt(year), parseInt(month)))
      : days31;

  // Khi day/month/year thay đổi, gọi onChange
  useEffect(() => {
    if (day && month && year) {
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange("");
    }
  }, [day, month, year, onChange]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-white">
        Ngày sinh
      </label>
      <div className="flex space-x-2">
        <select
          className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/30 text-black"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        >
          <option value="">Ngày</option>
          {daysInSelectedMonth.map((d) => {
            const val = d.toString().padStart(2, "0");
            return (
              <option key={val} value={val}>
                {d}
              </option>
            );
          })}
        </select>

        <select
          className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/30 text-black"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        >
          <option value="">Tháng</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/30 text-black"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        >
          <option value="">Năm</option>
          {years.map((y) => (
            <option key={y} value={y.toString()}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
