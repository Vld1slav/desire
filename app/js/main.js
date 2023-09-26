$(function () {
    $('.header__btn').on('click', function () {
        $('.rightside-menu').removeClass('rightside-menu--close');
    });
    $('.rightside-menu__close').on('click', function () {
        $('.rightside-menu').addClass('rightside-menu--close');
    });


    $('.top__slider').slick({
        dots: true,
        arrows: false,
        fade: true,
        autoplay: true,
    });

    $('.contact-slider').slick({
        slidesToShow: 10,
        slidesToScroll: 10,
        dots: true,
        arrows: false,
    });

    var mixer = mixitup('.gallery__inner', {
        load: {
            filter: '.bedroom'
        }
    });
})

const modal = document.getElementById('modal');
const btns = document.getElementById('openmodal');

function openModal(){
    modal.style.display = "flex";
}

function closeModal(){
    modal.style.display = "none";
}

btns.onclick = openModal;

window.onclick =  function(e){
    if(e.target === modal){
        closeModal();
    }
}


