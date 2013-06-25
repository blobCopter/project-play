var Place = require('../models/place');

exports.geo_service = function(req, res)
{
  if (!req.session.logged) {
    res.render('index', {});
    return;
  }

  Place.findOneAndRemove({username : req.session.username}, function(err, removed_place)
  {
    if (err)
    {
      res.send({ success : false, error :  "Server error (1)"});
      return;
    }

    var place = new Place({
      username : req.session.user.username,
      geo : [req.body.posX, req.body.posY]
    });

    place.findNear(function(err, places_near)
    {
      if (err) { res.send({ success : false, error :  "Server error : " + err }); return; }

      var results =
      {
        success : true,
        nearby : places_near
      };

      place.save(function(err, place_saved) { /* @ TODO*/  });

      res.send(results);
    });

  });
};

exports.geo_page = function(req, res)
{
  if (!req.session.logged)
  {
    res.render('index', {});
  }
  else
  {
    res.render('lookaround', {session : req.session});
  }
};
