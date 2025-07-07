const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');
const QuickChart = require('quickchart-js');

require('dotenv').config();

const supabaseUrl = 'https://coajmlurzlemzbkuuzbq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sendgridKey = process.env.SENDGRID_API_KEY;
const senderEmail = process.env.SENDGRID_SENDER_EMAIL;

const supabase = createClient(supabaseUrl, supabaseKey);
sgMail.setApiKey(sendgridKey);

async function getUsersWithEmailNotifications() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name')
    .eq('email_notifications', true);
  if (error) throw error;
  return data;
}

async function getMonthlyWorkoutStats(userId, monthStart, monthEnd) {
  const { data, error } = await supabase
    .from('weekly_workout_sessions')
    .select('completed_at')
    .eq('user_id', userId)
    .gte('completed_at', monthStart)
    .lte('completed_at', monthEnd);
  if (error) throw error;
  return data || [];
}

async function getMonthlyLoginCount(userId, monthStart, monthEnd) {
  const { data, error } = await supabase
    .from('login_history')
    .select('login_at')
    .eq('user_id', userId)
    .gte('login_at', monthStart)
    .lte('login_at', monthEnd);
  if (error) throw error;
  return data ? data.length : 0;
}

function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

function generateProgressChart(workoutDates) {
  // Count workouts per week in the month
  const weeks = {};
  workoutDates.forEach(({ completed_at }) => {
    const d = new Date(completed_at);
    const week = `${d.getFullYear()}-W${Math.ceil((d.getDate() + (d.getDay()||7)-1)/7)}`;
    weeks[week] = (weeks[week] || 0) + 1;
  });
  const labels = Object.keys(weeks).sort();
  const data = labels.map(l => weeks[l]);
  const chart = new QuickChart();
  chart.setConfig({
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Workouts per Week', data }],
    },
    options: {
      title: { display: true, text: 'Your Monthly Workout Progress' },
      legend: { display: false },
    },
  });
  chart.setWidth(500).setHeight(300).setBackgroundColor('white');
  return chart.getUrl();
}

async function sendProgressEmail(user, stats, chartUrl) {
  const { email, first_name, last_name } = user;
  const { totalWorkouts, loginCount } = stats;
  const html = `
    <h2>Hi ${first_name || last_name || email},</h2>
    <p>Here's your progress summary for this month:</p>
    <ul>
      <li><b>Total Workouts/Sessions:</b> ${totalWorkouts}</li>
      <li><b>Total Logins:</b> ${loginCount}</li>
    </ul>
    <img src="${chartUrl}" alt="Progress Chart" style="max-width:100%;" />
    <p>Keep up the great work! 💪</p>
    <p>- The Grow a Muscle Team</p>
  `;
  const msg = {
    to: email,
    from: senderEmail,
    subject: 'Your Monthly Progress Summary',
    html,
  };
  await sgMail.send(msg);
}

async function main() {
  const { start, end } = getMonthRange();
  const users = await getUsersWithEmailNotifications();
  for (const user of users) {
    const workouts = await getMonthlyWorkoutStats(user.id, start, end);
    const loginCount = await getMonthlyLoginCount(user.id, start, end);
    const chartUrl = generateProgressChart(workouts);
    await sendProgressEmail(user, { totalWorkouts: workouts.length, loginCount }, chartUrl);
    console.log(`Sent progress email to ${user.email}`);
  }
  console.log('All progress emails sent.');
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error sending progress emails:', err);
    process.exit(1);
  });
} 