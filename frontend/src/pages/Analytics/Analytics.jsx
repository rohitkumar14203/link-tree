import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import styles from './Analytics.module.css';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Analytics = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState('Feb 8th to Feb 15th');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
  
      try {
        setLoading(true);
        console.log('Fetching analytics data...');
        
        // Get token from user object
        const token = user?.token;
        
        const response = await axios.get(`${API_URL}/analytics`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            'Cache-Control': 'no-cache',
          }
        });
  
        console.log('API Response status:', response.status);
        
        if (response.data) {
          console.log('Analytics data received:', response.data);
          setAnalytics(response.data);
          setError('');
        } else {
          throw new Error('No data received from API');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        const errorMessage = error.response 
          ? `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
          : `Network error: ${error.message}`;
        setError(`Failed to load analytics data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAnalytics();
  }, [user]);

  // Line chart options and data
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false,
        cornerRadius: 4
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          color: '#888',
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#888',
          font: {
            size: 10
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 5,
      }
    }
  };

  const lineData = analytics ? {
    labels: analytics.monthlyData?.labels || [],
    datasets: [
      {
        data: analytics.monthlyData?.data || [],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
      },
    ],
  } : null;

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false,
        cornerRadius: 4
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          color: '#888',
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#888',
          font: {
            size: 10
          }
        }
      }
    },
    barThickness: 30,
    borderRadius: 4
  };

  // Device data
  const deviceData = analytics ? {
    labels: analytics.deviceData?.labels || [],
    datasets: [
      {
        data: analytics.deviceData?.data || [],
        backgroundColor: [
          '#86efac', // Light green
          '#4ade80', // Medium green
          '#155e39', // Dark green
          '#22c55e', // Bright green
          '#bbf7d0', // Very light green
          '#16a34a', // Forest green
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  } : null;

  // Site data
  const siteData = analytics ? {
    labels: analytics.siteData?.labels || [],
    datasets: [
      {
        data: analytics.siteData?.data || [],
        backgroundColor: [
          '#155e39', // Dark green
          '#4ade80', // Medium green
          '#86efac', // Light green
          '#bbf7d0', // Very light green
        ],
        borderWidth: 0,
        cutout: '70%',
        borderRadius: 4,
      },
    ],
  } : null;

  // Link data
  const linkData = analytics ? {
    labels: analytics.linkData?.labels || [],
    datasets: [
      {
        data: analytics.linkData?.data || [],
        backgroundColor: [
          '#86efac', // Light green
          '#4ade80', // Medium green
          '#155e39', // Dark green
          '#22c55e', // Bright green
          '#bbf7d0', // Very light green
          '#16a34a', // Forest green
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  } : null;

  if (loading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!analytics) {
    return <div className={styles.error}>No analytics data available</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Hi, {user?.firstName || 'User'}!</h1>
          <p>Congratulations. You got a great response today.</p>
        </div>
        <div className={styles.dateSelector}>
          <span>{dateRange}</span>
          <button className={styles.dateButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
            </svg>
          </button>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Overview</h2>
      
      <div className={styles.statsCards}>
        <div className={styles.statsCard}>
          <h3>Clicks on Links</h3>
          <p className={styles.statValue}>{analytics?.overview?.linkClicks?.toLocaleString() || '0'}</p>
        </div>
        <div className={styles.statsCard}>
          <h3>Click on Shop</h3>
          <p className={styles.statValue}>{analytics?.overview?.shopClicks?.toLocaleString() || '0'}</p>
        </div>
        <div className={styles.statsCard}>
          <h3>CTA</h3>
          <p className={styles.statValue}>{analytics?.overview?.ctaClicks?.toLocaleString() || '0'}</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        {lineData && <Line options={lineOptions} data={lineData} />}
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h3>Traffic by Device</h3>
          <div className={styles.barChartContainer}>
            {deviceData && <Bar options={barOptions} data={deviceData} />}
          </div>
        </div>
        <div className={styles.chartCard}>
          <h3>Sites</h3>
          <div className={styles.doughnutContainer}>
            {siteData && <Doughnut data={siteData} options={{ 
              plugins: { 
                legend: { display: false } 
              },
              cutout: '70%'
            }} />}
            <div className={styles.siteStats}>
              {analytics?.siteData?.labels?.map((label, index) => (
                <div key={label} className={styles.siteStat}>
                  <div className={styles.siteLabel}>
                    <span className={styles.siteDot} style={{ backgroundColor: siteData?.datasets[0].backgroundColor[index] }}></span>
                    <span>{label}</span>
                  </div>
                  <span>{analytics.siteData?.data[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <h3>Traffic by Links</h3>
        <div className={styles.barChartContainer}>
          {linkData && <Bar options={barOptions} data={linkData} />}
        </div>
      </div>
    </div>
  );
};

export default Analytics;