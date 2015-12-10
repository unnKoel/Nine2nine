/**
 * Created by common on 2015/12/9.
 */
define(function (require) {
    var $ = require('../lib/jquery-1.11.2'),
        base = require('../lib/uc_base');
    return function () {

        this.html = require('./lab_login.html');
        this.css = require('./lab_login.css');
        this.interactComs = {};
        this.lg_dialog = !1;
        this.topLevelEle = !1;

        /**
         * �滭��½������
         * @param container
         */
        this.drew = function (container) {
            var dialog = require("../com/dialog");
            $(container).append(this.html);
            this.topLevelEle = $('#lg-form');
            var lgForm = this.topLevelEle;
            lgForm.css('left', ($(window).width() - lgForm.width()) / 2);
            this.lg_dialog = new dialog().init("#lg-form", $(container));
            this.decorate();
            return this;
        };

        /**
         *���ý������
         * @param interactComs
         */
        this.setInteractComs = function (interactComs) {
            this.interactComs = interactComs;
            this.bind_submit();
        };

        /**
         * uiװ��
         */
        this.decorate = function () {
            base.ieCompatibility.JPlaceHolder.init();
            var supportPlaceHodler = base.ieCompatibility.JPlaceHolder._check(),
                self = this;
            if (!supportPlaceHodler) {  //���ie����յ�½�����
                setTimeout(function () {
                    self.topLevelEle.find('#loginname').val('');
                    self.topLevelEle.find('#nloginpwd').val('');
                }, 1);
            }
            self.topLevelEle.find('input').each(function () {
                $(this).keyup(function () {
                    var val = $(this).val(),
                        input = $(this),
                        closeEle = undefined;
                    if (!supportPlaceHodler) {   //������placeHolder��ie�����
                        closeEle = $(this).parent().next('.clear-btn')
                    } else {
                        closeEle = $(this).next('.clear-btn')
                    }
                    var display = closeEle.css('display');
                    if (val && display != 'inline') {
                        closeEle.css('display', 'inline').click(function () {
                            supportPlaceHodler ? void(0) : input.next('span').show();
                            input.val(''),
                                $(this).css('display', 'none')
                        });
                        return;
                    }
                    if (!val) {
                        closeEle.css('display', 'none');
                    }
                });

                $(this).focus(function () {
                    self.topLevelEle.find('.msg-error').addClass('hide'),
                        $(this).parents('.highlight').removeClass('item-error').addClass('item-focus');
                }).blur(function () {
                    $(this).parents('.highlight').removeClass('item-focus');
                });
            });
        };

        /**
         * ��½������
         */
        this.open = function () {
            this.lg_dialog.open();
        };

        /**
         * ���ύ�¼�
         * @param opts
         */
        this.bind_submit = function () {
            var self = this;
            $(document).keyup(function (event) {
                if (event.keyCode == 13) {
                    self.topLevelEle.find('#loginsubmit').click();
                }
            });
            self.topLevelEle.find('#loginsubmit').click(function () {
                var account = self.topLevelEle.find("#loginname").val(),
                    pwd = self.topLevelEle.find("#nloginpwd").val(),
                    autoLogin = self.topLevelEle.find('#autoLogin').is(':checked') ? 1 : 0;
                return 0 == $.trim(account).length && 0 == $.trim(pwd).length ? (
                    self.topLevelEle.find('.item-fore2').addClass('item-error'),
                        self.topLevelEle.find('.item-fore1').addClass('item-error'),
                        self.topLevelEle.find('.msg-error').removeClass('hide').html('<b></b>�������˻���������')
                ) : (
                    0 == $.trim(account).length ? (
                        self.topLevelEle.find('.item-fore1').addClass('item-error'),
                            self.topLevelEle.find('.msg-error').removeClass('hide').html('<b></b>�������˻���������')
                    ) : ( 0 == $.trim(pwd).length ? (
                            self.topLevelEle.find('.item-fore2').addClass('item-error'),
                                self.topLevelEle.find('.msg-error').removeClass('hide').html('<b></b>�������˻���������')
                        ) : (
                            $.ajax({
                                    url: base.domain + "/hh/user/login",
                                    type: "POST",
                                    dataType: "json",
                                    cache: !1,
                                    data: {
                                        account: account,
                                        password: pwd,
                                        rememberMe: autoLogin
                                    },
                                    success: function (result) {
                                        0 == result.code ?
                                            void(0 == result.code && (
                                                    base.cookieOperate.setCookie('caiker_uid', result.data.id, 20),
                                                        self.lg_dialog.close(),
                                                        self.interactComs.lab_head_tail.mod_user_status(result.data.name, self),
                                                        self.interactComs.lgCallback(result.data)  //��½�ص�
                                                )
                                            ) : self.topLevelEle.find('.msg-error').removeClass('hide').html('<b></b>�˻��������벻ƥ�䣬����������');
                                    }
                                }
                            )
                        )
                    )
                )
            });
        }
    };
});
