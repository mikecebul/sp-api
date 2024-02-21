import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "/usr/bin/google-chrome",
  });
  const page = await browser.newPage();

  await page.goto("https://account.simplepractice.com/");

  await page.type("#user_email", Bun.env.email!);
  await page.type("#user_password", Bun.env.password!);

  await Promise.all([
    page.waitForNavigation({ timeout: 10000 }),
    page.click("#submitBtn"),
  ]);

  await page.waitForFunction(
    'window.location.href === "https://secure.simplepractice.com/calendar/appointments"',
    { timeout: 30000 }
  );

  const cookies = await page.cookies();
  const sessionCookie = cookies.find(
    (cookie) => cookie.name === "simplepractice-session"
  );

  if (sessionCookie) {
    console.log("Cookie value:", sessionCookie.value);
  } else {
    console.log(cookies);
  }

  await browser.close();
})();
