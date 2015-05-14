/**
 * Created by madhurima on 20/2/15.
 */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight, 1, 100 );
camera.position.z = 33;

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;
renderer.setClearColor(0x000000, 0);
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change',render);

var temp = '{ "_id" : "53c11dee8abe78410b691fb7", "name" : "", "designType" : "closet", "price" : 23828, "userId" : "53a5a8718abe7865c918a0aa", "accessories" : {}, "committed_record_id" : "", "sessionId" : "1636n1cjfyczpmnh2i4iptvun8n061m4", "modifiedAt" : "2014-07-12T11:49:37.525Z", "isDeleted" : false, "externalImageUrl" : "https://kustommadetest.s3.amazonaws.com/external_53c120d08abe78410b691fc8", "designData" : { "hardwareColor" : "53bfe9b58abe782bf54975c6", "height" : 2000, "cost" : 23828, "thickness" : 18, "cornice" : "53bfe9bb8abe782bf5497609", "externalWoodType" : "PrelamPB", "pattern" : "53bfe9ad8abe782bf549753c", "has_canvas_images_grabbed" : true, "width" : 1900, "externalPattern" : "53bfe9ad8abe782bf549753c", "doorFrames" : "53bfe9c48abe782bf5497663", "doors" : { "type" : "traditional", "doorItems" : [ { "width" : 475, "mirrors" : {}, "type" : "single", "externalDrawersHeight" : 0, "slidepattern" : [] }, { "width" : 950, "mirrors" : {}, "type" : "double", "externalDrawersHeight" : 0, "slidepattern" : [] }, { "width" : 475, "mirrors" : {}, "type" : "single", "externalDrawersHeight" : 0, "slidepattern" : [] } ] }, "skirting" : "53bfe9c68abe782bf5497675", "totalWidth" : 2006.6, "sections" : [ { "width" : 475, "subSections" : [ { "type" : "normal", "name" : "shelf", "height" : 300 }, { "type" : "medium", "name" : "hanger", "height" : 925 }, { "name" : "empty", "height" : 328 }, { "type" : "normal", "name" : "shelf", "height" : 300 } ], "externalDrawersHeight" : 0 }, { "width" : 950, "subSections" : [ { "type" : "normal", "name" : "shelf", "height" : 300 }, { "type" : "normal", "name" : "shelf", "height" : 300 }, { "type" : "normal", "name" : "shelf", "height" : 300 }, { "type" : "normal", "name" : "shelf", "height" : 300 }, { "name" : "empty", "height" : 31 }, { "type" : "normal", "name" : "shelf", "height" : 300 }, { "type" : "small", "name" : "drawer", "height" : 100 }, { "type" : "medium", "name" : "drawer", "height" : 150 } ], "externalDrawersHeight" : 0 }, { "width" : 475, "subSections" : [ { "type" : "normal", "name" : "shelf", "height" : 300 }, { "type" : "short", "name" : "hanger", "height" : 725 }, { "name" : "empty", "height" : 192 }, { "type" : "normal", "name" : "shelf", "height" : 300 }, { "type" : "medium", "name" : "drawer", "height" : 150 }, { "type" : "medium", "name" : "drawer", "height" : 150 } ], "externalDrawersHeight" : 0 } ], "handle" : "53bfe9b78abe782bf54975df", "doorPattern" : null, "woodType" : "PrelamPB", "internalPattern" : "53bfe9ad8abe782bf549753c", "designId" : "53c11dee8abe78410b691fb7", "base" : 75, "internalWoodType" : "PrelamPB", "clearance" : 50 }, "internalImageUrl" : "https://kustommadetest.s3.amazonaws.com/internal_53c120d08abe78410b691fc7", "createdAt" : "2014-07-12T11:34:21.034Z", "isAutoSaved" : true }';
var temp2 = JSON.parse(temp);
var projector = new THREE.Projector();
var intersects = [];

var light = new THREE.AmbientLight(0xCCCCCC);
light.name = "light";
//scene.add(light);

var ray = new THREE.Raycaster( new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
var mouse = new THREE.Vector3();

//renderer.domElement.addEventListener('mousedown',onMOuseDown);

//wall width = 15ft and height = 10 ft
var wallwidth = 4572 / 100 ;
var wallheight = 3048 / 100 ;
var material = new THREE.MeshBasicMaterial({ color : 0xffffc8});
var backfaceGeo = new THREE.BoxGeometry(wallwidth, wallheight, 0);
var backface = new THREE.Mesh(backfaceGeo, material);
backface.position.set(0,0,0);
//scene.add(backface);

var topfaceGeo = new THREE.BoxGeometry(wallwidth, wallheight);
var mat = new THREE.MeshBasicMaterial({ color : 0xB2D0B4});

var topface = new THREE.Mesh(topfaceGeo,material);
backface.add(topface);
topface.position.set(0,wallheight / 2, 15);

var extralight = new THREE.PointLight(0xC81A4E, 1, 0);
extralight.position.set(0,wallheight / 2, 15);
//scene.add(extralight);


var topface2 = new THREE.Mesh(topfaceGeo,mat);
backface.add(topface2);
topface2.position.set(0,-wallheight / 2, 15);

var extralight2 = new THREE.PointLight(0xC81A4E, 1, 0);
extralight2.position.set(0,- wallheight / 2, 15);
//scene.add(extralight2);


var sidefacegeo = new THREE.BoxGeometry(0,wallheight,30);
var sidefacemat = new THREE.MeshBasicMaterial({color: 0xFFFFD3});
var sideface = new THREE.Mesh(sidefacegeo,sidefacemat);
sideface.position.set(-wallwidth/2 , 0, 15);
backface.add(sideface);
var sideface2 = new THREE.Mesh(sidefacegeo,sidefacemat);
sideface2.position.set(wallwidth/2 , 0, 15);
backface.add(sideface2);

var boxwidth = temp2.designData.width / 100 ;
var boxheight = temp2.designData.height/ 100;
var boxdepth = 4;


var geometry2 = new THREE.BoxGeometry(boxwidth,boxheight,0.1 );
var material2 = new THREE.MeshPhongMaterial( { map : THREE.ImageUtils.loadTexture("section.jpg")} );
var cube = new THREE.Mesh( geometry2, material2 );
cube.castShadow = true;
cube.dynamic = true;
cube.verticesNeedUpdate = true;
alert(cube.geometry.value);
cube.position.x = 0;
cube.position.y = -((wallheight / 2 ) - (boxheight / 2));
cube.position.z = 0;
backface.add(cube);
backface.name = "backface";
scene.add(backface);

camera.position.y = - boxheight / 2  + (1024 / 100);

var boxgeo = new THREE.BoxGeometry(0.1,boxheight,4);
var boxl = new THREE.Mesh(boxgeo,material2);
boxl.position.set(- boxwidth / 2 , 0 , 2);
cube.add(boxl);

var boxr = new THREE.Mesh(boxgeo,material2);
boxr.position.set(boxwidth / 2,0, 2);
cube.add(boxr);

var boxgeometry = new THREE.BoxGeometry(boxwidth,0.18,4);
var boxt = new THREE.Mesh(boxgeometry, material2);
boxt.position.set(0,boxheight/2 - 0.09,2);
cube.add(boxt);
var boxgeometry2 = new THREE.BoxGeometry(boxwidth,1,4);
var boxb = new THREE.Mesh(boxgeometry2,material2);
boxb.position.set(0,- (boxheight / 2) + 0.5 , 2);
cube.add(boxb);

var sectionmat;
var pos = boxwidth / 2;
var sections = temp2.designData.sections;
for(var i = 0;i < sections.length ; i++){
    var curpos = pos - (sections[i].width/100) ;
    var sectiongeo = new THREE.BoxGeometry(0.18,boxheight,3);
    sectionmat = new THREE.MeshPhongMaterial({
        map : THREE.ImageUtils.loadTexture("section.jpg")
    });
    var sectionpart = new THREE.Mesh(sectiongeo,sectionmat);
    sectionpart.position.set(-curpos,0,1.5);
    if ( i != sections.length - 1 ){
        cube.add(sectionpart);
    }
    var subsec = sections[i].subSections;
    var cur = boxheight /2 ;
    for(var j = 0; j < subsec.length  ; j++){
        if (subsec[j].name == "shelf" || subsec[j].name == "shoeUnits"){
            var shelfgeo = new THREE.BoxGeometry(sections[i].width / 100 , 0.18 , 3);
            var shelf = new THREE.Mesh(shelfgeo , sectionmat);
            cur -= (subsec[j].height/ 100) + 0.18  ;
            shelf.position.set(- pos + (sections[i].width / 200),cur , 1.5 );
            cube.add(shelf);
        }
        else if(subsec[j].name == "hanger"){
            var hangergeo = new THREE.CylinderGeometry(0.2,0.2,sections[i].width/100,5);
            var hangermat = new THREE.MeshLambertMaterial({color : 0x151312 });
            var hanger = new THREE.Mesh(hangergeo,hangermat);
            hanger.rotation.z = 1.575;
            hanger.position.set(- pos + (sections[i].width / 200), cur - 0.6 , 2);
            cube.add(hanger);
            cur -= (subsec[j].height/ 100) + 0.1;
        }
        else if(subsec[j].name == "empty"){
            cur -= (subsec[j].height/ 100);
        }
        else if(subsec[j].name == "drawer"){
            var sideGeo = new THREE.BoxGeometry(0.18,subsec[j].height / 100 , 3);
            var side1 = new THREE.Mesh(sideGeo , sectionmat);
            side1.position.set(- pos + 0.09,cur - (subsec[j].height/ 200)  , 1.5);
            cube.add(side1);
            var sideGeo = new THREE.BoxGeometry(0.18,subsec[j].height / 100 , 3);
            var side2 = new THREE.Mesh(sideGeo , sectionmat);
            side2.position.set(- curpos - 0.09,cur - (subsec[j].height/ 200)  , 1.5);
            cube.add(side2);
            var shelfgeo = new THREE.BoxGeometry(sections[i].width / 100 , 0.18 , 3);
            var shelf1 = new THREE.Mesh(shelfgeo , sectionmat);
            cur -= (subsec[j].height/ 100);
            shelf1.position.set(- pos + (sections[i].width / 200),cur , 1.5 );
            cube.add(shelf1);
            var shelfgeo2 = new THREE.BoxGeometry(sections[i].width / 100 , subsec[j].height / 100 ,0.18);
            var shelf2 = new THREE.Mesh(shelfgeo2 , sectionmat );
            shelf2.position.set(- pos + (sections[i].width / 200) , cur + (subsec[j].height/ 200) , 3);
            cube.add(shelf2);
        }
    }
    pos = curpos;
}

var doormat = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture("door.jpg")});
pos = boxwidth / 2  ;
var doors = temp2.designData.doors.doorItems;

var totaldoors = [];

for ( var i = 0; i < doors.length ; i++ ){
    if(doors[i].type == "single"){
        var doorsGeo = new THREE.BoxGeometry(doors[i].width / 100 + 0.18  , temp2.designData.height / 100 - 0.18  , 0.18);
        var door = new THREE.Mesh(doorsGeo , doormat);
        door.position.set( - pos + (doors[i].width / 200), 0, 4 );
        cube.add(door);
        door.name = "door".concat(i);
        totaldoors[totaldoors.length] = door;
        pos -= (doors[i].width / 100)  ;
    }
    if(doors[i].type == "double"){
        var doorsGeo1 = new THREE.BoxGeometry(doors[i].width / 200 + 0.18  , temp2.designData.height / 100 - 0.18  , 0.18);
        var door1 = new THREE.Mesh(doorsGeo1 , doormat);
        door1.position.set( - pos + (doors[i].width / 400), 0, 4 );
        cube.add(door1);
        door1.name = "door".concat(i);
        totaldoors[totaldoors.length] = door1;
        pos -= (doors[i].width / 200) ;
        var door2 = new THREE.Mesh(doorsGeo1 , doormat);
        door2.position.set( - pos + (doors[i].width / 400), 0, 4 );
        cube.add(door2);
        door2.name = "door".concat(i) ;
        totaldoors[totaldoors.length] = door2;
        pos -= (doors[i].width / 200) ;
    }
}

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame( render );
}
function onMOuseDown(event){

    event.preventDefault();

    var mx = (event.clientX / window.innerWidth) * 2 - 1;
    var my = -(event.clientY / window.innerHeight) * 2 + 1;
    var mz = 4;
    mouse.set(mx,my,mz);

    ray.setFromCamera( mouse, camera );

    intersects = ray.intersectObjects(totaldoors);
    //alert(intersects[0].object.name);

    if(intersects.length){
         if (intersects[0].object.visible == false) {
             intersects[0].object.visible = true;
         }
        else
         intersects[0].object.visible = false;
    }
}
var FizzyText = function() {
    this.width = temp2.designData.width / 100 ;
    this.height = temp2.designData.height / 100 ;
    this.color = true;
    this.message ="string ";

};
window.onload = function() {
    var text = new FizzyText();
    var gui = new dat.GUI();
    gui.add(text,'message');
    var ward = gui.addFolder('wardrobe');
    var ward1 = ward.add(text,'width',15,30);
    var wardheight = ward.add(text,'height', 15,40);
    var wardcolor = ward.add(text,'color');

    ward1.onFinishChange(function(value){

        alert("width = " + temp2.designData.width/ 100);

        for(var i =0;i < scene.children.length ; i++ ){
            var obj = scene.children[i];
        }
        cube.scale.x = value  * 100 / temp2.designData.width ;
        temp2.designData.width = value * 100;
        text.color = false;

    });

    wardheight.onFinishChange(function(value){
        cube.scale.y = value * 100 / temp2.designData.height ;
    });

    wardcolor.onFinishChange(function(value){
       cube.material.color.set(0xffffff);
    });
    var update = function() {
        requestAnimationFrame(update);
        // Iterate over all controllers
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    };
};

//var light = new THREE.PointLight( 0xffffff, 0.5, 100 );
//light.position.set( -wallwidth / 2 , wallheight / 2 - 1, 5 );
//scene.add( light );
//scene.add(new THREE.PointLightHelper(light , 1));
//
//var light1 = new THREE.PointLight( 0xffffff, 0.5, 100 );
//light1.position.set( wallwidth / 2 , wallheight / 2 - 1, 5 );
//scene.add( light1 );
//scene.add(new THREE.PointLightHelper(light1 , 1));

var light2 = new THREE.SpotLight(0xffffff , 1 );
light2.position.set(-wallwidth / 2 + 5 , wallheight / 2 - 2  ,24  );
light2.distance = 150;
light2.target.position.set(0,- wallheight / 2 , 0);
light2.castShadow = true;
scene.add(light2);
scene.add(new THREE.SpotLightHelper(light2));

var light3 = new THREE.SpotLight(0xffffff , 0.6 );
light3.position.set(wallwidth / 2 - 5 , wallheight / 2 - 2  ,24  );
light3.distance = 150;
light3.castShadow = true;
light3.target.position.set(0 , -wallheight  , 0 );
scene.add(light3);
scene.add(new THREE.SpotLightHelper(light3));

var light5 = new THREE.SpotLight(0xffffff , 1);
light5.position.set(0 , - wallheight  , 14);
light5.target.position.set(2, - wallheight  , 2);
light5.distance = 35;
scene.add(light5);
scene.add(new THREE.SpotLightHelper(light5));

//var light4 = new THREE.SpotLight(0xffffff , 0.3 );
//light4.position.set(0, -wallheight / 2  ,-14  );
//light4.distance = 0;
//light4.castShadow = true;
//scene.add(light4);
//scene.add(new THREE.SpotLightHelper(light4));

var amblight = new THREE.AmbientLight(0xffffff);
//scene.add(amblight);

camera.position.x = -5;

FizzyText();
render();

