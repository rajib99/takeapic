// How the admin groups media. `hints` say where a slot appears on the site.
export const MEDIA_FOLDERS = [
  { id: "hero", label: "Hero video", note: "The video on the right of the home page and the Takeapic page.", add: false },
  { id: "robot", label: "Robot section", note: "Photos and clips in the “Meet the robot” section (home and Takeapic pages). studio.jpg is also the Takeapic card photo.", add: false },
  { id: "vogue", label: "Magazine booth", note: "The main clip, the strip clip and the cover photos. cover-06.jpg is also the Magazine card photo.", add: true },
  { id: "booths", label: "Magic Mirror", note: "The Magic Mirror video, used on its page and in the gallery. mirror.jpg is also the Magic Mirror card photo.", add: false },
  { id: "360", label: "360 booth", note: "Placeholder photos until the client sends real ones. photo-01.jpg is also the 360 card photo.", add: true },
  { id: "gallery", label: "Event gallery", note: "Every photo in the Gallery page. A handful are also used on the home page and Magic Mirror page.", add: true },
  { id: "site", label: "Logo", note: "Header and footer logo. (The browser-tab icon is a code file and is changed by a developer.)", add: false },
] as const;
export type MediaFolderId = (typeof MEDIA_FOLDERS)[number]["id"];

/** Folders where the admin can add/remove photos, and the file-name prefix the site filters on. */
export const ADDABLE: Record<string, string> = { gallery: "event", "360": "photo", vogue: "cover" };
