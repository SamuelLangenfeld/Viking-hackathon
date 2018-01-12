var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var models = require("./../models");
var Story = mongoose.model("Story");
var LatestStory = mongoose.model("LatestStory");


router.get("/current", async(req, res) => {
  try {
    let latestStory = await LatestStory.findOne();
    if (!latestStory) {
      return res.render('stories/new');
    }
    story = await Story.findById(latestStory.story);
    res.render("stories/current", { story });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.stack)
  };
});

router.post("/current", async(req, res) => {
  try {
    let latestStory = await LatestStory.findOne();
    story = await Story.findById(latestStory.story);
    if (!story) {
      return res.render('stories/new');
    }
    story.sections.push({ body: req.body.body, author: req.body.author });
    await story.save();
    if (story.sections.length >= story.maxSections) {
      let latestId = await LatestStory.findOne();
      await latestId.remove();
      req.flash('success', "You finished the story!");
      req.method = "GET";
      return res.redirect(`/stories/${story._id}`);
    }
    req.method = "GET";
    res.redirect('/stories/current');
  } catch (e) {
    console.error(e);
    res.status(500).send(e.stack)
  };
});

router.post("/new", async(req, res) => {
  try {
    let story = await Story.create({ sections: [], title: req.body.title, maxSections: req.body.maxSections });
    let latestStory = await LatestStory.create({ story: story });
    latestStory.story = story.id;
    await latestStory.save();
    req.flash('success', "You created a new Story!");
    req.method = "GET";
    res.redirect('/stories/current')
  } catch (e) {
    console.error(e);
    res.status(500).send(e.stack)
  }
})

router.get("/:id", async(req, res) => {
  try {
    let story = await Story.findById(req.params.id)
    res.render("stories/show", { story });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.stack)
  };
})


router.get("/", async(req, res) => {
  try {
    let stories = await Story.find({}).sort({ createdAt: -1 });
    let latest = await LatestStory.findOne();
    if (latest) {
      stories = stories.filter(story => {
        return story.id != latest.story;
      });
    }
    res.render("stories/index", { stories });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.stack)
  };
})


module.exports = router;