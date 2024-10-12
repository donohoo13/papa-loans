import './app.css'
import App from './App.svelte'
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const app = new App({
  target: document.getElementById('app')!,
})

export default app
