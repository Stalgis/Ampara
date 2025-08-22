# Ampara

## Physical Device Testing

Set the Expo static environment variable `EXPO_PUBLIC_SERVER_URL` to your computer's LAN IP and backend port so the app can reach the development server when running on a physical device:

```sh
EXPO_PUBLIC_SERVER_URL=192.168.1.2:3000 expo start
```

Replace `192.168.1.2` with your machine's LAN address.
