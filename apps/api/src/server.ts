import { app } from './app';
import { env } from './lib/env';

app.listen(env.PORT, () => {
  console.log(`HealTrip API running on port ${env.PORT}`);
});
