// cable.ts
import { createConsumer } from "@rails/actioncable"

const cable = createConsumer(import.meta.env.VITE_WS_URL)

export default cable
