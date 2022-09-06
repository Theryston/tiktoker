# Command Reference for tiktoker

## config

```bash
tiktoker config
```

Create inicial configuration (database, when all videos/profiles if stored in)

## Profile Create

```bash
tiktoker profile create
```

A profile is a collection of videos, so to create a video you need to select a profile, you need of a profile

## delete a profile

```bash
tiktoker profile delete
```

if you want to delete a profile run it. Remember that this will delete all videos of the selected profile

## list profiles

```bash
tiktoker profile list
```

Return a table of profiles

## create a video

```bash
tiktoker video create
```

This will create a video for the selected profile. Before this, you need to create a folder with any name into your profile folder and inside it create a file called `info.json` with the following contents:

```json
{
  "netflixLink": "https://www.netflix.com/..."
}
```

into `netflixLink` enter with a link of a netflix quick laughs

## Delete a video

```bash
tiktoker video delete
```

Delete a video

## List videos

```bash
tiktoker video list
```

List all videos already created

## import

```bash
tiktoker import
```

Import videos folders in a directory
