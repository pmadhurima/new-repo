/**
 * Created by madhurima on 25/2/15.
 */


var scene,camera,renderer,controls, ray, mouse,data, exporter;
var wallHeight = 30.48;
var wallWidth = 50;
var wallDepth = 30;
var wardrobeDepth = 610;
var sectionDepth = 5.10;
var materialWeight = 0.18;
var bottomweight = 1.01;
var allDoors = [];
var textureImage = 'texture5.jpg';
var imagesArray = ['texture5.jpg','texture2.jpg','texture3.jpg','texture4.jpg','texture6.jpg'];
var jsondata = '{"hardwareColor": "542dcb2cb50f3b08ab88bc63", "height": 2133.6, "cost": 28765.0, "has_canvas_images_grabbed": true, "cornice": null, "isLoftEnabled": false, "externalWoodType": "PrelamPB", "pattern": "542dca85b50f3b08ab88bb54", "thickness": 18, "width": 2083.6, "externalPattern": "542dca85b50f3b08ab88bb54", "doorFrames": "542dcc27b50f3b08ab88bd23", "doors": {"type": "traditional", "doorItems": [{"width": 833.4399999999999, "mirrors": {}, "type": "double", "externalDrawersHeight": 0, "slidepattern": []}, {"width": 833.4399999999999, "mirrors": {}, "type": "double", "externalDrawersHeight": 0, "slidepattern": []}, {"externalDrawersHeight": 0, "handleDirection": "left", "mirrors": {}, "slidepattern": [], "width": 416.71999999999997, "type": "single"}]}, "skirting": null, "totalWidth": 2133.6, "sections": [{"width": 833.4399999999999, "subSections": [{"type": "empty", "name": "empty", "height": 152.5999999999999}, {"type": "normal", "name": "shelf", "height": 300}, {"name": "empty", "height": 102}, {"type": "normal", "name": "shelf", "height": 300}, {"name": "empty", "height": 102}, {"type": "normal", "name": "shelf", "height": 300}, {"name": "empty", "height": 103}, {"type": "normal", "name": "shelf", "height": 300}, {"name": "empty", "height": 309}], "externalDrawersHeight": 0}, {"width": 833.4399999999999, "subSections": [{"type": "empty", "name": "empty", "height": 152.5999999999999}, {"type": "normal", "name": "shelf", "height": 300}, {"type": "medium", "name": "hanger", "height": 925}, {"name": "empty", "height": 100}, {"type": "large", "name": "drawer", "height": 200}, {"name": "empty", "height": 309}], "externalDrawersHeight": 0}, {"width": 416.71999999999997, "subSections": [{"type": "empty", "name": "empty", "height": 152.5999999999999}, {"type": "normal", "name": "shelf", "height": 300}, {"type": "medium", "name": "hanger", "height": 925}, {"type": "normal", "name": "shelf", "height": 300}, {"name": "empty", "height": 309}], "externalDrawersHeight": 0}], "handle": "542dcb57b50f3b08ab88bc84", "woodType": "PrelamPB", "internalPattern": "542dca85b50f3b08ab88bb54", "designId": "54d0b48a05eedc3d8b564b81", "base": 75, "internalWoodType": "PrelamPB", "slideSubPattern": "traditional", "printPattern": null, "clearance": 50}';

window.onload = function() {
    init();
};

function processForm(form){
    jsondata = form.jsondata.value;
    form.elements['color'].value = 0;
    form.elements['doorstatus'].value = 0;
    textureImage = imagesArray[0];
    redraw();
}

function changeColor(form){
    form.elements['doorstatus'].value = 0;
    textureImage = imagesArray[form.elements['color'].value];
    redraw();
}

function updatedoors(form){
    if(form.elements['doorstatus'].value == 0){
        for( var i = 0; i <allDoors.length ; i ++){
            allDoors[i].visible = true;
        }
    }
    else {
        for(var i =0 ; i < allDoors.length ; i++){
            allDoors[i].visible = false;
        }
    }

}

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 35, window.innerWidth/window.innerHeight, 1, 100 );
    camera.position.z = 60 ;

    renderer = new THREE.WebGLRenderer({alpha : true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.setClearColor(0x000000,0);

    var divElement = document.getElementById("renderer");
    divElement.appendChild( renderer.domElement );

    //controls = new THREE.OrbitControls(camera);
    //controls.addEventListener('change',render);

    drawRoom(wallWidth,wallHeight);

    data = readJSON(jsondata);

    ray = new THREE.Raycaster( new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0));
    mouse = new THREE.Vector3();
    renderer.domElement.addEventListener('mousedown',onMOuseDown);

    exporter = new THREE.OBJExporter();

    var light1 = new THREE.SpotLight(0xffffff,1);
    light1.position.set(-wallWidth / 2 , wallHeight / 2 - 2 , 24  );
    light1.target.position.set(0 , -wallHeight / 2 , wardrobeDepth / 100 + 1  );
    scene.add(light1);

    var light2  = new THREE.SpotLight(0xffffff , 0.6 );
    light2.position.set(wallWidth / 2 , wallHeight / 2 - 2 , 24 );
    light2.target.position.set(0 , -wallHeight , wardrobeDepth / 100 + 1  );
    scene.add(light2);

    var light3 = new THREE.SpotLight(0xffffff , 1);
    light3.position.set(0 , -wallHeight , 24);
    light3.target.position.set(2,-wallHeight , wardrobeDepth / 100 );
    light3.distance = 30;
    scene.add(light3);

    addLight(0x666666);

    redraw();

    render();
}

function createObject(width,height,depth,color,posX,posY,posZ,parent,name){

    var geometry = new THREE.BoxGeometry(width,height,depth);

    var textureWidth = 30.48,textureHeight = 24.38;

    var face1 = [

            new THREE.Vector2(0 , height / textureHeight),
            new THREE.Vector2(0 , 0),
            new THREE.Vector2(width / textureWidth , 0),
            new THREE.Vector2(width / textureWidth , height / textureHeight )
    ];

    var face2 = [

            new THREE.Vector2(0 , height / textureHeight),
            new THREE.Vector2(0 ,0 ),
            new THREE.Vector2(depth / textureWidth , 0),
            new THREE.Vector2(depth / textureWidth , height / textureHeight )
    ];
    var face3 = [
            new THREE.Vector2(0 , depth / textureHeight),
            new THREE.Vector2(0,0),
            new THREE.Vector2(width / textureWidth , 0),
            new THREE.Vector2(width / textureWidth , depth / textureHeight )
    ];

    geometry.faceVertexUvs[0] = [];

    geometry.faceVertexUvs[0][10] = [face1[0] , face1[1],face1[3]];
    geometry.faceVertexUvs[0][11] = [face1[1] , face1[2],face1[3]];

    geometry.faceVertexUvs[0][2] = [face2[0],face2[1],face2[3] ];
    geometry.faceVertexUvs[0][3] = [face2[1],face2[2],face2[3] ];

    geometry.faceVertexUvs[0][0] = [ face2[0],face2[1],face2[3] ];
    geometry.faceVertexUvs[0][1] = [ face2[1],face2[2],face2[3] ];

    geometry.faceVertexUvs[0][8] = [face1[0] , face1[1],face1[3]];
    geometry.faceVertexUvs[0][9] = [face1[1] , face1[2],face1[3]];

    geometry.faceVertexUvs[0][6] = [face3[0],face3[1],face3[3] ];
    geometry.faceVertexUvs[0][7] = [face3[1],face3[2],face3[3] ];

    geometry.faceVertexUvs[0][4] = [ face3[0],face3[1],face3[3] ];
    geometry.faceVertexUvs[0][5] = [ face3[1],face3[2],face3[3] ];

    var texture = THREE.ImageUtils.loadTexture(textureImage);
    var objMat = new THREE.MeshPhongMaterial( { map : texture } );

    var obj = new THREE.Mesh(geometry,objMat);
    obj.castShadow = obj.receiveShadow = true;
    obj.position.set(posX , posY, posZ);
    obj.name = name;
    parent.add(obj);
    return obj;
}

function drawRoom(width,height){
    createBasicObject(width,height ,0,0xFFFFC8,0,0,0,scene,"wallbackface");

    createBasicObject(width,1.5  , 0 , 0xA9A9A9 , 0 , - height / 2 + 0.01 , 0.01 , scene, "border");

    createBasicObject(0,height,wallDepth , 0xFFFFD3 ,-wallWidth / 2 , 0, wallDepth / 2 ,scene,"walleftface");

    createBasicObject(0,1.5 ,wallDepth , 0xA9A9A9 ,-wallWidth / 2 + 0.01 , - wallHeight / 2 + 0.75 , wallDepth / 2 ,scene,"border");

    createBasicObject(0,wallHeight,wallDepth , 0xFFFFD3 , wallWidth / 2 , 0, wallDepth / 2  ,scene,"wallrightface");

    createBasicObject(0,1.5 ,wallDepth, 0xA9A9A9 ,wallWidth / 2 - 0.01, - wallHeight / 2 + 0.75 , wallDepth / 2 ,scene,"border");

    createTexureObject(wallWidth , 0, wallDepth ,'tile.jpg' , 0 , -wallHeight / 2 , wallDepth / 2 , scene , "wallbottomface" );

    createBasicObject(wallWidth , 0, wallDepth ,0xFFFFF2 , 0 , wallHeight / 2 , wallDepth / 2 , scene , "walltopface" );
}

function createBasicObject(width , height , depth , color , posX , posY , posZ , parent , name){
    var basicMesh = new THREE.Mesh(
        new THREE.BoxGeometry(width , height , depth ),
        new THREE.MeshBasicMaterial({color:color})
    )
    basicMesh.position.set(posX , posY , posZ);
    basicMesh.name = name;
    parent.add(basicMesh);
    return basicMesh;
}

function createTexureObject(width , height , depth , image , posX , posY , posZ , parent , name){
    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width , height , depth ),
        new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture(image)})
    );
    mesh.position.set(posX,posY , posZ);
    mesh.name = name ;
    parent.add(mesh);
    return mesh;
}

function createDrawerObject(width, height , depth , posX, posY ,posZ , parent , name ){
    var textureWidth = 30.48,textureHeight = 24.38;
    var geometry = new THREE.BoxGeometry(width,height,depth);
    var face1 = [
        new THREE.Vector2(0 , 0),
        new THREE.Vector2(width / textureWidth , 0),
        new THREE.Vector2(width / textureWidth , height / textureHeight ),
        new THREE.Vector2(0 , height / textureHeight)
    ];
    var face2 = [
            new THREE.Vector2(0 ,0 ),
            new THREE.Vector2(depth / textureWidth , 0),
            new THREE.Vector2(depth / textureWidth , height / textureHeight ),
            new THREE.Vector2(0 , height / textureHeight)
    ];
    var face3 = [
            new THREE.Vector2(0,0),
            new THREE.Vector2(width / textureWidth , 0),
            new THREE.Vector2(width / textureWidth , depth / textureHeight ),
            new THREE.Vector2(0 , depth / textureHeight)
    ];
    var texture = THREE.ImageUtils.loadTexture(textureImage);
    geometry.faceVertexUvs[0] = [];

    geometry.faceVertexUvs[0][10] = [face1[0] , face1[1],face1[3]];
    geometry.faceVertexUvs[0][11] = [face1[1] , face1[2],face1[3]];

    geometry.faceVertexUvs[0][2] = [face2[0],face2[1],face2[3] ];
    geometry.faceVertexUvs[0][3] = [face2[1],face2[2],face2[3] ];

    geometry.faceVertexUvs[0][0] = [ face2[0],face2[1],face2[3] ];
    geometry.faceVertexUvs[0][1] = [ face2[1],face2[2],face2[3] ];

    geometry.faceVertexUvs[0][8] = [face1[0] , face1[1],face1[3]];
    geometry.faceVertexUvs[0][9] = [face1[1] , face1[2],face1[3]];

    geometry.faceVertexUvs[0][6] = [face3[0],face3[1],face3[3] ];
    geometry.faceVertexUvs[0][7] = [face3[1],face3[2],face3[3] ];

    geometry.faceVertexUvs[0][4] = [ face3[0],face3[1],face3[3] ];
    geometry.faceVertexUvs[0][5] = [ face3[1],face3[2],face3[3] ];

    var obj = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial( { map : texture } )
    );
    obj.castShadow = obj.receiveShadow = true;
    obj.position.set(posX , posY, posZ);
    obj.name = name;
    parent.add(obj);
    return obj;

}

function drawBasicShape(width,height,depth , type) {
    if(type.indexOf("loft") != -1) {
        createObject(width, height, materialWeight, 0x663300, 0   ,-wallHeight / 2 + height / 2 + data.height / 100   , 0, scene, type + "base");
    }
    else {
        createObject(width, height, materialWeight, 0x663300, 0   ,-wallHeight / 2 + height / 2   , 0, scene, type + "base");
    }
    createObject(materialWeight , height , depth , 0x663300,  - width / 2 , 0 , depth / 2 , scene.getObjectByName(type + "base") , type + "left" );
    createObject(materialWeight , height , depth , 0x663300 ,   width / 2 , 0 , depth / 2 , scene.getObjectByName(type + "base") , type + "right" );
    if(type.indexOf("loft") != -1) {
        createObject(width , materialWeight , depth , 0x663300 , 0 , - height / 2 , depth / 2 , scene.getObjectByName(type + "base") , type + "bottom" );
    }
    else {
        createObject(width , bottomweight , depth , 0x663300 , 0 , - height / 2 + bottomweight / 2   , depth / 2 , scene.getObjectByName(type + "base") , type + "bottom" );
    }
    createObject(width , materialWeight , depth , 0x663300 , 0 ,  height / 2 , depth / 2 , scene.getObjectByName(type + "base") , type + "top" );
}

function createHanger(width1,width2,height,depth,color,posX,posY,posZ,parent,name){
    var objGeo = new THREE.CylinderGeometry(width1,width2,height,depth);
    var objMat = new THREE.MeshBasicMaterial({ color : 0xBBBBBB, map : THREE.ImageUtils.loadTexture("hanger.jpg")});
    var obj = new THREE.Mesh(objGeo,objMat);
    obj.position.set(posX , posY, posZ);
    obj.name = name;
    obj.rotation.z = 1.575;
    parent.add(obj);
    return obj;
}

function addDoors(data){
    var doors = data.doors.doorItems;
    var pos = data.width / 200 ;
    var sections = data.sections;
    var changeHeight = 0;
    for ( var i = 0; i < doors.length ; i++ ){
        if(sections[i].externalDrawersHeight !=0 ){
            data.height -= sections[i].externalDrawersHeight;
            changeHeight = sections[i].externalDrawersHeight / 150;
        }
        if(doors[i].type == "single"){
            var door1 = createObject(doors[i].width / 100 , data.height / 100 - bottomweight - materialWeight * changeHeight, materialWeight , 0x663300, - pos + doors[i].width / 200 , sections[i].externalDrawersHeight / 200 + bottomweight/2 + materialWeight * changeHeight / 2    , wardrobeDepth / 100 , scene.getObjectByName('wardrobebase'),'door' + i + '-0');
            createObject(0.05 , data.height / 100 - bottomweight - materialWeight * changeHeight, 0.01 , 0x000000 , doors[i].width / 200 , 0 , 0.1 , door1 , "dooredge");
            var handle1 = createBasicObject(0.1, 1.5, 0.1 , 0x000000 , doors[i].width / 200 - 0.5  ,0.1 ,  0.5 , door1 , "handle" );
            pos -= (doors[i].width / 100)  ;
            allDoors[allDoors.length] = door1;
        }
        else if(doors[i].type == "double"){
            var door1 = createObject(doors[i].width / 200 , data.height / 100 - bottomweight - materialWeight * changeHeight, materialWeight , 0x663300, - pos + doors[i].width / 400 , sections[i].externalDrawersHeight / 200 + bottomweight /2 + materialWeight * changeHeight / 2  , wardrobeDepth / 100 , scene.getObjectByName('wardrobebase'),'door' + i + '-0');
            createObject(0.05 , data.height / 100 - bottomweight - materialWeight * changeHeight , 0.01 , 0x000000 , doors[i].width / 400 , 0 , 0.1 , door1 , "dooredge");
            var handle1 = createBasicObject(0.1, 1.5, 0.1 , 0x000000 , doors[i].width / 400 - 0.5  ,0.1 ,  0.5 , door1 , "handle" );
            pos -= (doors[i].width / 200) ;
            allDoors[allDoors.length] = door1;
            var door2 = createObject(doors[i].width / 200 , data.height / 100 - bottomweight- materialWeight * changeHeight , materialWeight , 0x663300, - pos + doors[i].width / 400 ,sections[i].externalDrawersHeight / 200 + bottomweight / 2 + materialWeight * changeHeight / 2  , wardrobeDepth / 100 , scene.getObjectByName('wardrobebase'),'door' + i + '-0');
            createObject(0.05 , data.height / 100 - bottomweight - materialWeight * changeHeight , 0.01 , 0x000000 , doors[i].width / 400 , 0 , 0.1 , door2 , "dooredge");
            var handle2 = createBasicObject(0.1, 1.5, 0.1 , 0x000000 ,- doors[i].width / 400 + 0.5 ,-0.1 , 0.5 , door2 , "handle" );
            pos -= (doors[i].width / 200) ;
            allDoors[allDoors.length] = door2;
        }
        data.height += sections[i].externalDrawersHeight;
    }
}

function addSections(data){
    var sections = data.sections;
    var sectionsPosition =  - data.width / 200;
    var parent = scene.getObjectByName("wardrobebase");
    for(var i = 0 ; i < sections.length ; i++){
        var sec = createObject(materialWeight , data.height / 100 , wardrobeDepth / 100 , 0x663300 , sectionsPosition + sections[i].width / 100 , 0 , wardrobeDepth / 200 , parent ,"section" + i);
        if(i == sections.length - 1 ){
            sec.visible = false ;
        }
        var subsections = sections[i].subSections;
        var subsectionposition = data.height / 200 ;
        for(var j = 0; j < subsections.length ; j++){
            if(subsections[j].name == "shelf" || subsections[j].name == "shoeUnits"){
                createDrawerObject(sections[i].width / 100 , materialWeight , sectionDepth , sectionsPosition + sections[i].width / 200 , subsectionposition - subsections[j].height / 100 , sectionDepth / 2 , parent , "shelf"+ j );
                subsectionposition -= subsections[j].height / 100 + materialWeight;
            }
            else if(subsections[j].name == "hanger"){
                createHanger(0.15,0.15,sections[i].width / 100 ,3, 0x404040  , sectionsPosition + sections[i].width / 200 , subsectionposition - 0.5 , sectionDepth/2 , parent , "hanger");
                subsectionposition -= subsections[j].height / 100 + (materialWeight ) ;
            }
            else if(subsections[j].name == "drawer" ){
                var temp = 0;
                if ((data.height / 200 - subsectionposition) <= sections[i].externalDrawersHeight ){
                    temp = sectionDepth;
                    sectionDepth = wardrobeDepth / 100 ;
                }
                createDrawerObject(materialWeight , subsections[j].height / 100 , sectionDepth , sectionsPosition + materialWeight , subsectionposition - subsections[j].height / 200, sectionDepth / 2 , parent, "drawerleftface");
                createDrawerObject(sections[i].width / 100 , materialWeight , sectionDepth , sectionsPosition + sections[i].width / 200 , subsectionposition - subsections[j].height / 100 , sectionDepth / 2 , parent , "drawerbase"+j );
                createDrawerObject(materialWeight , subsections[j].height / 100 , sectionDepth  , sectionsPosition - materialWeight + sections[i].width / 100  , subsectionposition - subsections[j].height / 200 , sectionDepth / 2 , parent, "drawerleftface");
                var front = createDrawerObject(sections[i].width / 100 - materialWeight * 2 ,subsections[j].height / 100 , materialWeight , sectionsPosition + sections[i].width / 200 , subsectionposition - subsections[j].height / 200 , sectionDepth, parent , "drawerfrontface" );
                createBasicObject(1.5 , 0.1 , 0.1 , 0x000000 , 0 , 0.3 , 0.1 , front , "handle");
                createDrawerObject(sections[i].width / 100 , materialWeight , sectionDepth  , sectionsPosition + sections[i].width / 200 , subsectionposition , sectionDepth / 2 , parent , "drawerbase"+j );
                subsectionposition -= subsections[j].height / 100 + materialWeight ;
                if(temp != 0){
                    sectionDepth = temp;
                    temp = 0;
                }
            }
            else if(subsections[j].name == "empty"){
                subsectionposition -= subsections[j].height / 100 ;
            }
        }
        sectionsPosition += sections[i].width / 100  ;
    }
}

function redraw(){
    data = readJSON(jsondata);
    var obj = scene.getObjectByName("wardrobebase");
    scene.remove(obj);
    scene.remove(scene.getObjectByName("loftbase"));
    drawBasicShape(data.width / 100 , data.height / 100 , wardrobeDepth / 100  , "wardrobe" );
    addSections(data);
    allDoors = [];
    if(data.doors.type == 'traditional' ||  "external"){
        addDoors(data);
    }
    //if(data.isLoftEnabled == true){
    //    drawBasicShape(data.loft.width / 100 , data.loft.height / 100 , wardrobeDepth / 100 , "loft");
    //}
}

function addLight(lightColor){
    var light = new THREE.AmbientLight(lightColor);
    scene.add(light);
}

function readJSON(stringJSON) {
    var dataObject = JSON.parse(stringJSON);
    return dataObject;
}

function onMOuseDown(event){

    event.preventDefault();

    var mx = (event.clientX / window.innerWidth) * 2 - 1;
    var my = -(event.clientY / window.innerHeight) * 2 + 1;
    var mz = 5;
    mouse.set(mx,my,mz);

    ray.setFromCamera( mouse, camera );

    intersects = ray.intersectObjects(allDoors);

    if(intersects.length){
        //alert(intersects[0].object.name);
         if (intersects[0].object.visible == false) {
             intersects[0].object.visible = true;
         }
        else
         intersects[0].object.visible = false;
    }
}

function render(){
    requestAnimationFrame(render);
    //controls.update();
    renderer.render(scene , camera);
}


