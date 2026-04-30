# 🌱 Kayla's Garden

A personal garden tracking app you can self-host for your household. It helps you catalog plants, log watering and progress updates, upload photos, browse a built-in plant library, and keep activity attributed to individual household members.

## Tech stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Azure Blob Storage for plant, profile, and image data
- Aspire TypeScript AppHost for local orchestration and deployment
- OpenTelemetry instrumentation

## Prerequisites

- Node.js 20+
- npm
- [Aspire CLI](https://learn.microsoft.com/dotnet/aspire/fundamentals/setup-tooling)
- Docker Desktop (used by Aspire to run the local Azure Storage emulator)

## Quick start

```bash
git clone https://github.com/cinnamon-msft/kaylas-garden.git
cd kaylas-garden
npm install
aspire start
```

Then:

1. Open the Aspire dashboard from the URL shown in the terminal.
2. Open the `web` app endpoint.
3. Create a household profile on first visit and start tracking plants.

If you prefer npm scripts, `npm run aspire:start` runs the same `aspire start` command.

## Configuration

The AppHost exposes three branding parameters. Aspire reads these from AppHost configuration and injects them into the web app as environment variables.

### Set values from the CLI

Set Aspire parameter values before starting the app:

**bash/zsh**

```bash
Parameters__gardenName="Riverbank Garden" \
Parameters__gardenTheme="ocean" \
Parameters__ownerName="Taylor" \
aspire start
```

**PowerShell**

```powershell
$env:Parameters__gardenName = "Riverbank Garden"
$env:Parameters__gardenTheme = "ocean"
$env:Parameters__ownerName = "Taylor"
aspire start
```

### Set values from the Aspire dashboard

Start the app, open the Aspire dashboard, update the parameter values for the AppHost, and restart the `web` resource if needed. If you do nothing, the app uses the defaults below.

| Aspire parameter | App env var | Default | Description |
| --- | --- | --- | --- |
| `gardenName` | `GARDEN_NAME` | `My Garden` | Display name shown in the page title, header, welcome copy, and footer. |
| `gardenTheme` | `GARDEN_THEME` | `green` | Color theme for the UI. Supported values: `green`, `earth`, `ocean`. |
| `ownerName` | `OWNER_NAME` | `""` | Optional owner name used in personalized copy. Leave blank for a neutral/shared experience. |

### Branding behavior

All user-facing branding is environment-driven. If you fork this repo, you do not need to replace hard-coded `Kayla's Garden` strings in the app — set the parameters above and the UI will pick them up automatically.

## Household profiles

This app includes a lightweight, no-password profile system for shared household use.

- Profiles have a `name` and `avatarEmoji`.
- The profile picker is shown on first visit and the active profile is remembered in `localStorage`.
- Watering events and plant timeline entries record which profile performed them.
- Profiles are stored in Azure Blob Storage alongside the rest of the garden data.
- API endpoints:
  - `GET /api/profiles`
  - `POST /api/profiles`
  - `DELETE /api/profiles/[id]`

This makes the app work well for families, roommates, or anyone sharing responsibility for the same garden.

## Deployment notes

### Aspire / Azure Container Apps

This repo is set up to work well with Aspire-managed deployments, including Azure Container Apps. Provision Azure Storage, supply the branding parameters above, and publish/deploy through Aspire.

### Any Node.js host

You can also run the Next.js app on any Node.js host if you provide Blob Storage configuration yourself:

- `PLANTDATA_CONNECTIONSTRING` for connection-string based access, or
- `PLANTDATA_URI` for managed identity / endpoint-based access
- Optional: `PLANTDATA_BLOBCONTAINERNAME` (defaults to `plantdata`)

Set `GARDEN_NAME`, `GARDEN_THEME`, and `OWNER_NAME` directly on the host if you are not running through Aspire.

## License

MIT
