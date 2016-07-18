[issues]: 			https://github.com/nwbb/node-brightcove/issues

[media-docs]:		http://docs.brightcove.com/en/media/
[media-docs-tokens]:		http://support.brightcove.com/en/video-cloud/docs/managing-media-api-tokens
[media-docs-video-read]:	http://docs.brightcove.com/en/media/#Video_Read
[media-docs-video-write]: 	http://docs.brightcove.com/en/media/#Video_Write
[media-docs-playlist-read]:		http://docs.brightcove.com/en/media/#Playlist_Read
[media-docs-playlist-write]:	http://docs.brightcove.com/en/media/#Playlist_Write
[media-docs-search]:	http://support.brightcove.com/en/video-cloud/docs/searching-videos-media-api

[analytics-api-docs]:	http://docs.brightcove.com/en/video-cloud-analytics-api/


node-brightcove
=========================================================================

This humble library aims to be a simple facade over Brigthcove's 
server APIs.  As the mob demands additional functionality, it will 
be added here.

- [Installation](#installation)
- [Media API](#media-api)
	- [Calls](#mediaapi-calls)
	- [Options](#mediaapi-options)
	- [Events](#mediaapi-events)
- [OAuth API](#oauth-api)
- [Policy API](#policy-api)


Installation
-------------------------------------------------------------------------
Installation is handled via [npm](http://npmjs.org):

	$ npm install brightcove

Brightcove offers several response formats, but this library 
demands JSON responses and, wherever possible, passes them through 
to you.


Media API
-------------------------------------------------------------------------
The `MediaApi` object acts as the facade for all of the [Media API's 
calls and options][media-docs]. 

It is instance-based, allowing you to juggle more than one 
[Brightcove Token][media-docs-tokens], if needed.

	var brightcove = require('brightcove');
	var	mediaApi = new brightcove.MediaApi('myTokenOfAwesomeness');


### MediaApi Calls ###
Brightcove breaks up its Media API calls between Videos (read/write) 
and Playlists (read/write).  For organizational purposes, that's how 
they're listed here:

**[Video Read API][media-docs-video-read]**

+ **`findAllVideos`** (options, _[callback]_)

+ **`findVideoById`** (videoId, options, _[callback]_)
	+ `videoId` Brightcove-assigned ID

+ **`findVideosByIds`** (videoIds, options, _[callback]_)
	+ `videoIds` is a simple array of brightcove video IDs

+ **`findRelatedVideos`** (videoId, referenceId, options, _[callback]_)
	+ `videoId` _(optional)_ Brightcove-assigned ID of the video we'd 
    like to find related videos for
	+ `referenceId` _(optional)_ User-assigned ID of the video we'd like 
	to find related videos for

+ **`findVideoByReferenceId`** (referenceId, options, _[callback]_)
	+ `referenceId` User-assigned, optional ID attached to a video

+ **`findVideosByReferenceIds`** (referenceIds, options, _[callback]_) 
	+ `referenceIds` is a simple array of brightcove video IDs

+ **[searchVideos][media-docs-search]** (all, any, none, exact, options, 
_[callback]_)
	+ `all, any, none` Array of strings. At least one argument must be 
	set.  Others are optional.
	+ `all` Videos must contain all of the specified tags
	+ `any` Videos can contain any of the specified tags
	+ `none` Videos must **not** contain any of the specified tags
	+ `exact` Boolean value.  If true, disables fuzzy search and requires 
	tags to match exactly. 


**[Video Write API][media-docs-video-write]**

+ **`createVideo`** (video, _[callback]_)
+ **`updateVideo`** (video, _[callback]_)
+ **`deleteVideo`** (video, _[callback]_)
	+ `video` Use the `brightcove.Video` facade to build this 
	object.

**[Playlist Read API][media-docs-playlist-read]**

+ **`findAllPlaylists`** (options, _[callback]_)

+ **`findPlaylistById`** (playlistId, options, _[callback]_)
	+ `playlistId` Brightcove-assigned ID

+ **`findPlaylistsByIds`** (playlistIds, options, _[callback]_)
	+ `playlistIds` is a simple array of brightcove playlist IDs

+ **`findPlaylistByReferenceId`** (referenceId, options, _[callback]_)
	+ `referenceId` User-assigned, optional ID attached to a playlist

+ **`findPlaylistsByReferenceIds`** (referenceIds, options, _[callback]_)
	+ `referenceIds` is a simple array of brightcove playlist IDs


**[Playlist Write API][media-docs-playlist-write]**

+ **`createPlaylist`** (playlist, _[callback]_)
	+ `playlist` Use the `brightcove.Playlist` facade to build this 
	object.


### MediaApi Options ###
Most of the **read** calls require an `options` parameter which wraps 
up all of the available options Brightcove offers for its responses 
via the `Options` object. 

These options govern:

+ what fields are returned for each video/playlist in the response 
from Brightcove
+ pagination of returned videos/playlists
+ sorting of returned videos/playlists
+ which video streaming delivery type to use
+ etc.

The `Options` object is created via the `MediaApi` instance.  A 
convenience method is included to quickly create the usually included 
fields, paging, and sorting options:

	var options = mediaApi.withDefaultOptions();

However, you're likely going to define your own.  To do that, a fluent 
interface was created to make things easier:

	var options = mediaApi.withOptions
						.havingPageSizeOf(10).atPage(2)
						.sortingBy().creationDate().inAscendingOrder();

Notice that the return chain is context-aware.  If you're rocking 
intellisense in your editor, this should be a breeze.

Here's a crazy example:

	var options = mediaApi.withOptions()
						.includingCountOfItems()
						.havingPageSizeOf(10).atPage(2)
						.sortingBy().totalPlays().inDescendingOrder()
						.includingVideoField().videoId()
						.includingVideoField().title()
						.includingVideoField().shortDescription()
						.includingVideoField().longDescription()
						.includingVideoField().creationDate()
						.includingVideoField().publishedDate()
						.includingVideoField().lastModifiedDate()
						.includingVideoField().linkUrl()
						.includingVideoField().linkText()
						.includingVideoField().tags()
						.includingVideoField().videoStillUrl()
						.includingVideoField().thumbnailUrl()
						.includingVideoField().referenceId()
						.includingVideoField().duration()
						.includingVideoField().economics()
						.includingVideoField().playsTotal()
						.includingVideoField().playsTrailingWeek()
						.includingVideoField().videoUrl()
						.includingVideoField().renditions()
						.includingVideoField().iOSRenditions()
						.includingVideoField().FLVFullLength()
						.includingVideoField().videoFullLength()
						.httpMediaDelivery();

	mediaApi.findAllVideos(options);


### MediaApi Events ###
The `MediaApi` object also inherits from node's Event Emitter, allowing 
you to more easily manage callbacks.  

	// Abstracted handler
	var findAllVideosHandler = function(err, jsonResponse) {
		console.log(jsonResponse);
	}

	// Register the handler
	// Note the specific event name: 'find_all_videos'
	mediaApi.on('find_all_videos', findAllVideosHandler);

	// Make the call.
	mediaApi.findAllVideos(mediaApi.withDefaultOptions());

All events are emitted with two arguments: `err, jsonResponse`.  
Following node convention, the `err` argument will be null if no error 
occurred as will `jsonResponse` if an error _did_ occur.

**Emitted events** will have a name in congruence with Brightcove's own 
command names:

- Video Read API
	- `find_all_videos`
	- `find_video_by_id`
	- `find_videos_by_ids`
	- `find_related_videos`
	- `find_video_by_reference_id`
	- `find_videos_by_reference_ids`
	- `search_videos`

- Playlist Read API
	- `find_all_playlists`
	- `find_playlist_by_id`
	- `find_playlists_by_ids`
	- `find_playlist_by_reference_id`
	- `find_playlists_by_reference_ids`

- Video Write API
	- `create_video`
	- `update_video`
	- `delete_video`

- Playlist Write API
	- `create_playlist`
	- `update_playlist`
	- `delete_playlist`

If you'd like _programmatic_ or _intellisense-friendly_ access to these, 
they can be accessed with the `commands` property:  

	// Register the handler 
	// Specify the event name using the 'commands' enum
	mediaApi.on(mediaApi.commands.find_all_videos, findAllVideosHandler);

	// Make the call.
	mediaApi.findAllVideos(mediaApi.withDefaultOptions());

<br />
<br />

OAuth API
-------------------------------------------------------------------------

How to use :

	var brightcove = require('brightcove');
	var	oauthApi = new brightcove.OAuthApi('myClientId', 'myClientSecret');


+ **`getAccessToken`** (_[callback]_)

+ **`createClientCredential`** (_[callback]_) _(not yet implemented)_

+ **`deleteClientCredential`** (_[callback]_) _(not yet implemented)_

+ **`getClientCredentialById`** (_[callback]_) _(not yet implemented)_

+ **`getClientCredential`** (_[callback]_) _(not yet implemented)_

+ **`updateClientCredential`** (_[callback]_) _(not yet implemented)_

<br />
<br />

Policy API
-------------------------------------------------------------------------
How to use :

	var brightcove = require('brightcove');
	var	oauthApi = new brightcove.OAuthApi('myClientId', 'myClientSecret');
	var	policyApi = new brightcove.PolicyApi('myAccountId', oauthApi);

+ **`getPolicyKey`** (_[callback]_)

+ **`getPolicy`** (keyString, _[callback]_)
	+ `keyString` Policy key string returned by getPolicyKey()


<br />
<br />

Support / Fixes / Comments
-------------------------------------------------------------------------
Issues and comments should go through [github][issues].  I'll do my 
best to manage them.

Any help is appreciated, too.  I'll respond as quickly as I can to 
all pull requests and comments.

<br />
<br />

Useful Links
-------------------------------------------------------------------------
 - [Brightcove Media API Reference][media-docs]
 - [Brightcove Video Cloud Analytics API Reference][analytics-api-docs]

