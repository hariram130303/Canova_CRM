import { useEffect, useState } from "react";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import styles from "../styles/Dashboard.module.css";
import empStyles from "../styles/Employees.module.css";
import StatsCard from "../components/StatsCard";

import { FaMoneyBills } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineHandshake } from "react-icons/md";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/admin/employees");
        setEmployees(res.data.data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    async function loadStats() {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    }

    loadStats();
  }, []);


  const RoundedBar = (props) => {
    const { x, y, width, height, fill } = props;

    const radius = 25; // make bigger if you want more curve

    return (
      <path
        d={`
        M${x},${y + radius}
        a${radius},${radius} 0 0 1 ${radius * 1},${-radius}
        H${x + width - radius}
        a${radius},${radius} 0 0 1 ${radius},${radius}
        V${y + height}
        H${x}
        Z
      `}
        fill={fill}
      />
    );
  };

  const salesData = [
    { day: "Sat", value: 18 },
    { day: "Sun", value: 32 },
    { day: "Mon", value: 18 },
    { day: "Tue", value: 6 },
    { day: "Wed", value: 18 },
    { day: "Thu", value: 60 },
    { day: "Fri", value: 45 },

    { day: "Sat", value: 35 },
    { day: "Sun", value: 18 },
    { day: "Mon", value: 20 },
    { day: "Tue", value: 10 },
    { day: "Wed", value: 3 },
    { day: "Thu", value: 8 },
    { day: "Fri", value: 34 },
  ];


  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.pageContent}>
        <Header showSearch searchValue={search} onSearch={setSearch} />

        <div className={styles.wrapper}>
          <div className={styles.topBar}>
            <div className={styles.breadcrumb}>
              Home <span>&gt;</span> Employees
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.cards}>
            <StatsCard
              icon={<FaMoneyBills size={20} />}
              label="Unassigned Leads"
              value={stats.unassigned ?? 0}
            />

            <StatsCard
              icon={<FaRegUser size={20} />}
              label="Assigned This Week"
              value={stats.week ?? 0}
            />

            <StatsCard
              icon={<MdOutlineHandshake size={20} />}
              label="Active Salespeople"
              value={stats.active ?? 0}
            />

            <StatsCard
              icon={
                <svg
                  width="19"
                  height="17"
                  viewBox="0 0 19 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.92708 16.5229C4.37708 16.5076 3.85382 16.3663 3.35729 16.099C2.86076 15.8316 2.39097 15.4382 1.94792 14.9188C1.33681 14.1854 0.859375 13.3108 0.515625 12.2948C0.171875 11.2788 0 10.2361 0 9.16667C0 7.89861 0.240625 6.70694 0.721875 5.59167C1.20313 4.47639 1.85625 3.50625 2.68125 2.68125C3.50625 1.85625 4.47639 1.20313 5.59167 0.721875C6.70694 0.240625 7.89861 0 9.16667 0C10.4347 0 11.6264 0.244444 12.7417 0.733333C13.8569 1.22222 14.8271 1.88681 15.6521 2.72708C16.4771 3.56736 17.1302 4.55278 17.6115 5.68333C18.0927 6.81389 18.3333 8.02847 18.3333 9.32708C18.3333 10.5035 18.1424 11.6035 17.7604 12.6271C17.3785 13.6507 16.8361 14.5139 16.1333 15.2167C15.7056 15.6444 15.2549 15.9691 14.7812 16.1906C14.3076 16.4122 13.8264 16.5229 13.3375 16.5229C13.0625 16.5229 12.7875 16.4885 12.5125 16.4198C12.2375 16.351 11.9625 16.2479 11.6875 16.1104L10.4042 15.4688C10.2208 15.3771 10.026 15.3083 9.81979 15.2625C9.61354 15.2167 9.39583 15.1938 9.16667 15.1938C8.9375 15.1938 8.71979 15.2167 8.51354 15.2625C8.30729 15.3083 8.1125 15.3771 7.92917 15.4688L6.64583 16.1104C6.35556 16.2632 6.0691 16.374 5.78646 16.4427C5.50382 16.5115 5.21736 16.5382 4.92708 16.5229ZM4.97292 14.6896C5.11042 14.6896 5.25174 14.6743 5.39687 14.6438C5.54201 14.6132 5.68333 14.5597 5.82083 14.4833L7.10417 13.8417C7.425 13.6736 7.75729 13.5514 8.10104 13.475C8.44479 13.3986 8.79236 13.3604 9.14375 13.3604C9.49514 13.3604 9.84653 13.3986 10.1979 13.475C10.5493 13.5514 10.8854 13.6736 11.2063 13.8417L12.5125 14.4833C12.65 14.5597 12.7875 14.6132 12.925 14.6438C13.0625 14.6743 13.2 14.6896 13.3375 14.6896C13.6278 14.6896 13.9028 14.6132 14.1625 14.4604C14.4222 14.3076 14.6819 14.0785 14.9417 13.7729C15.4306 13.1924 15.8125 12.4972 16.0875 11.6875C16.3625 10.8778 16.5 10.0451 16.5 9.18958C16.5 7.14236 15.7896 5.40451 14.3688 3.97604C12.9479 2.54757 11.2139 1.83333 9.16667 1.83333C7.11944 1.83333 5.38542 2.55139 3.96458 3.9875C2.54375 5.42361 1.83333 7.16528 1.83333 9.2125C1.83333 10.0833 1.97465 10.9313 2.25729 11.7563C2.53993 12.5813 2.93333 13.2764 3.4375 13.8417C3.69722 14.1472 3.94931 14.3649 4.19375 14.4948C4.43819 14.6247 4.69792 14.6896 4.97292 14.6896ZM9.16667 11C9.67083 11 10.1024 10.8205 10.4615 10.4615C10.8205 10.1024 11 9.67083 11 9.16667C11 9.04444 10.9885 8.92222 10.9656 8.8C10.9427 8.67778 10.9083 8.55556 10.8625 8.43333L12.0083 6.89792C12.1611 7.09653 12.2948 7.3066 12.4094 7.52813C12.524 7.74965 12.6194 7.99028 12.6958 8.25H14.575C14.3458 6.90556 13.7233 5.80556 12.7073 4.95C11.6913 4.09444 10.5111 3.66667 9.16667 3.66667C7.82222 3.66667 6.63819 4.09826 5.61458 4.96146C4.59097 5.82465 3.97222 6.92083 3.75833 8.25H5.6375C5.85139 7.425 6.28681 6.76042 6.94375 6.25625C7.60069 5.75208 8.34167 5.5 9.16667 5.5C9.42639 5.5 9.67083 5.52292 9.9 5.56875C10.1292 5.61458 10.3507 5.68333 10.5646 5.775L9.39583 7.35625C9.36528 7.35625 9.32708 7.35243 9.28125 7.34479C9.23542 7.33715 9.19722 7.33333 9.16667 7.33333C8.6625 7.33333 8.2309 7.51285 7.87188 7.87188C7.51285 8.2309 7.33333 8.6625 7.33333 9.16667C7.33333 9.67083 7.51285 10.1024 7.87188 10.4615C8.2309 10.8205 8.6625 11 9.16667 11Z"
                    fill="#616161"
                  />
                </svg>
              }
              label="Conversion Rate"
              value={`${stats.rate ?? 0}%`}
            />
          </div>

          {/* Chart + Activity */}
          <div className={styles.middleGrid}>
            <div className={styles.chartBox}>
              <h4>Sale Analytics</h4>

              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 6" vertical={false} />

                    <XAxis dataKey="day" axisLine={false} tickLine={false} />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                      domain={[0, 60]}
                    />

                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      formatter={(v) => `${v}%`}
                    />

                    <Bar
                      dataKey="value"
                      radius={[6]}
                      shape={RoundedBar}
                      fill="#D9D9D9"
                      width={5}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.activityBox}>
              <h4>Recent Activity Feed</h4>

              <ul>
                <li>You assigned a lead — 1 hour ago</li>
                <li>Jay closed a deal — 2 hours ago</li>
              </ul>
            </div>
          </div>

          <div className={empStyles.card}>
            {/* HEADER */}
            <div className={styles.tableHeader}>
              <div className={styles.headerItem}>Name</div>
              <div className={styles.headerItem}>Employee ID</div>
              <div className={styles.headerItem}>Assigned Leads</div>
              <div className={styles.headerItem}>Closed Leads</div>
              <div className={styles.headerItem}>Status</div>
            </div>

            {/* ROWS */}
            {employees.slice(0, 4).map((emp) => (
              <div className={styles.row} key={emp._id}>
                <div className={styles.nameCell}>
                  <div className={styles.avatar}>
                    {(emp.firstName?.[0] || "") + (emp.lastName?.[0] || "")}
                  </div>

                  <div className={styles.ename}>
                    <div className={styles.name}>
                      {emp.firstName} {emp.lastName}
                    </div>

                    <div className={styles.email}>{emp.email}</div>
                  </div>
                </div>

                <div className={styles.badge}>#{emp._id.slice(-13)}</div>

                <div className={empStyles.leads}>{emp.assigned || 0}</div>

                <div className={empStyles.leads}>{emp.closed || 0}</div>

                <div>
                  <span
                    className={
                      emp.status === "active"
                        ? empStyles.active
                        : empStyles.inactive
                    }
                  >
                    {emp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
