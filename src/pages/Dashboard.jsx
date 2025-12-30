import { useEffect, useState } from "react";
import { api } from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import styles from "../styles/Dashboard.module.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
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

        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
        />

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
          shape={<RoundedBar/>}
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

          {/* Table */}
          <div className={styles.tableBox}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Assigned Leads</th>
                  <th>Closed Leads</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {/* Example rows — replace with real data */}
                <tr>
                  <td>Tanner Finsha</td>
                  <td>#234546HGJY76</td>
                  <td>5</td>
                  <td>2</td>
                  <td><span className={styles.activeDot}></span> Active</td>
                </tr>

                <tr>
                  <td>Emeto Winner</td>
                  <td>#234546HGJY76</td>
                  <td>3</td>
                  <td>1</td>
                  <td><span className={styles.activeDot}></span> Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
