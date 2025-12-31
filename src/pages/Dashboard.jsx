import { useEffect, useState } from "react";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import styles from "../styles/Dashboard.module.css";
import empStyles from "../styles/Employees.module.css";

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

  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");

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
          {/* Cards */}
          <div className={styles.cards}>
            <div className={styles.card}>
              <span>Unassigned Leads</span>
              <b>{stats.unassigned ?? 0}</b>
            </div>

            <div className={styles.card}>
              <span>Assigned This Week</span>
              <b>{stats.week ?? 0}</b>
            </div>

            <div className={styles.card}>
              <span>Active Salespeople</span>
              <b>{stats.active ?? 0}</b>
            </div>

            <div className={styles.card}>
              <span>Conversion Rate</span>
              <b>{stats.rate ?? 0}%</b>
            </div>
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
                      shape={<RoundedBar />}
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
