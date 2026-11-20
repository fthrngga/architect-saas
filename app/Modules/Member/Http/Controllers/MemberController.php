<?php

namespace App\Modules\Member\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Member\Models\Member;
use App\Modules\Member\Http\Requests\StoreMemberRequest;
use Inertia\Inertia;

class MemberController extends Controller
{
    public function index()
    {
        return Inertia::render('Member/Index', [
            'items' => Member::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('Member/Form');
    }

    public function store(StoreMemberRequest $request)
    {
        Member::create($request->validated());
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'members'
        ]);
    }

    public function edit($id)
    {
        $item = Member::findOrFail($id);
        return Inertia::render('Member/Form', [
            'item' => $item
        ]);
    }

    public function update(StoreMemberRequest $request, $id)
    {
        $item = Member::findOrFail($id);
        $item->update($request->validated());
        
        return redirect()->route('app.module.index', [
            'handle' => request()->route('handle'),
            'project_slug' => request()->route('project_slug'),
            'module_name' => 'members'
        ]);
    }

    public function destroy($id)
    {
        $item = Member::findOrFail($id);
        $item->delete();
        
        return redirect()->back();
    }
}
