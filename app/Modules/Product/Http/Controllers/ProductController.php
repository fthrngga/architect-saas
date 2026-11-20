<?php

namespace App\Modules\Product\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Product\Models\Product;
use App\Modules\Product\Http\Requests\StoreProductRequest;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Product/Index', [
            'items' => Product::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('Product/Form');
    }

    public function store(StoreProductRequest $request)
    {
        Product::create($request->validated());
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'products'
        ]);
    }

    public function edit($id)
    {
        $item = Product::findOrFail($id);
        return Inertia::render('Product/Form', [
            'item' => $item
        ]);
    }

    public function update(StoreProductRequest $request, $id)
    {
        $item = Product::findOrFail($id);
        $item->update($request->validated());
        
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'products'
        ]);
    }

    public function destroy($id)
    {
        $item = Product::findOrFail($id);
        $item->delete();
        
        return redirect()->back();
    }
}
