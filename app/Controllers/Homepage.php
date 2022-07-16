<?php

namespace App\Controllers;

use App\Models\TestModel;

class Homepage extends BaseController {
    public function index() {
        $testModel = model(TestModel::class);
        $testModel->test();

        

        return view('welcome_message');
    }
}